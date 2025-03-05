package com.mediquick.web.controller;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.service.ImageService;
import jcifs.CIFSContext;
import jcifs.context.SingletonContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import lombok.RequiredArgsConstructor;
import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ViewerRestController {

    @Value("${smb.username}")
    private String USERNAME;
    @Value("${smb.password}")
    private String PASSWORD;
    @Value("${smb.url}")
    private String SMB_URL;

    private final ImageService imageService;

    // 지정된 studykey 에 속한 시리즈별 이미지 메타데이터를 반환
    @GetMapping("/dicom/{studykey}")
    public ResponseEntity<List<Map<String, ?>>> getDicomMetadataBySeries(@PathVariable("studykey") int studykey) {
        List<Image> images = imageService.getImagesByStudyKey(studykey);

        if (images == null || images.isEmpty()) return ResponseEntity.noContent().build();

        // 시리즈별로 이미지 그룹화
        Map<Integer, List<Map<String, ?>>> groupedBySeries = getIntegerListMap(images);

        // SeriesImages 리스트 생성
        List<Map<String, ?>> seriesImagesList = new ArrayList<>();
        for (Map.Entry<Integer, List<Map<String, ?>>> entry : groupedBySeries.entrySet()) {
            int seriesKey = entry.getKey();
            List<Map<String, ?>> imageInfos = entry.getValue();

            NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(USERNAME, PASSWORD);
            CIFSContext baseContext = SingletonContext.getInstance();
            CIFSContext context = baseContext.withCredentials(auth);

            // 시리즈 첫 번째 파일의 메타데이터 추출
            Map<String, ?> firstImage = imageInfos.get(0);
            Map<String, ?> metadata = extractDicomMetadata(firstImage, context);

            Map<String, Object> seriesImages = new HashMap<>();
            seriesImages.put("studykey", studykey);
            seriesImages.put("serieskey", seriesKey);
            seriesImages.put("images", imageInfos);
            seriesImages.put("imageCount", imageInfos.size());
            seriesImages.put("modality", metadata.get("modality"));
            seriesImages.put("bodyPart", metadata.get("bodyPart"));

            seriesImagesList.add(seriesImages);
        }

        // 시리즈 키 기준으로 정렬
        seriesImagesList.sort(Comparator.comparingInt(m -> (int) m.get("serieskey")));

        return ResponseEntity.ok(seriesImagesList);
    }

    // 지정된 studykey 와 serieskey 에 해당하는 메타정보를 반환 * 뷰포트 오버레이에 활용
    @GetMapping("/dicom/{studykey}/{serieskey}")
    public ResponseEntity<?> getSeriesImages(@PathVariable("studykey") int studykey, @PathVariable("serieskey") int serieskey) {
        if (studykey < 1 || serieskey < 1) return ResponseEntity.badRequest().build();

        List<Image> images = imageService.getSeriesImages(studykey, serieskey);
        if (images == null || images.isEmpty()) return ResponseEntity.noContent().build();

        Image image = images.get(0);
        String smbFilePath = SMB_URL + image.getPath().replace("\\", "/") + image.getFname();

        Map<String, String> overlayData = new HashMap<>();

        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(USERNAME, PASSWORD);
        CIFSContext baseContext = SingletonContext.getInstance();
        CIFSContext context = baseContext.withCredentials(auth);

        try (SmbFile smbFile = new SmbFile(smbFilePath, context);
             SmbFileInputStream smbInputStream = new SmbFileInputStream(smbFile);
             DicomInputStream dicomInputStream = new DicomInputStream(smbInputStream)) {

            if (smbFile.exists() && smbFile.isFile()) {
                Attributes attributes = dicomInputStream.readDataset();

                overlayData.put("patientName", attributes.getString(Tag.PatientName, "Unknown"));
                overlayData.put("patientID", attributes.getString(Tag.PatientID, "Unknown"));
                overlayData.put("modality", attributes.getString(Tag.Modality, "Unknown"));
                overlayData.put("studyDate", attributes.getString(Tag.StudyDate, "Unknown"));
                overlayData.put("studyDescription", attributes.getString(Tag.StudyDescription, "Unknown"));
                overlayData.put("seriesNumber", attributes.getString(Tag.SeriesNumber, "Unknown"));
                overlayData.put("bodyPart", attributes.getString(Tag.BodyPartExamined, "Unknown"));
                overlayData.put("institutionName", attributes.getString(Tag.InstitutionName, "Unknown"));
                overlayData.put("sliceThickness", attributes.getString(Tag.SliceThickness, "Unknown"));
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body("DICOM 파일 처리 중 오류: " + e.getMessage());
        }
        return ResponseEntity.ok(overlayData);
    }

    // WADO 요청으로 지정된 시리즈의 DICOM 파일을 Base64로 인코딩하여 리스트 반환
    @GetMapping("/wado")
    public ResponseEntity<List<String>> getDicomSeries(
            @RequestParam("requestType") String requestType, @RequestParam("studykey") Integer studykey,
            @RequestParam("serieskey") Integer serieskey) throws IOException {

        if (!"WADO".equals(requestType) || studykey == null || serieskey == null) return ResponseEntity.badRequest().build();

        List<Image> images = imageService.getSeriesImages(studykey, serieskey);
        if (images == null) return ResponseEntity.notFound().build();

        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(USERNAME, PASSWORD);
        CIFSContext baseContext = SingletonContext.getInstance();
        CIFSContext context = baseContext.withCredentials(auth);

        List<String> encodingSeries = new ArrayList<>();
        for (Image image : images) {
            String smbFilePath = SMB_URL + image.getPath().replace("\\", "/") + image.getFname();
            SmbFile smbFile = new SmbFile(smbFilePath, context);

            if (smbFile.exists() && smbFile.isFile()) {
                try (SmbFileInputStream inputStream = new SmbFileInputStream(smbFile)) {
                    // 파일을 바이트 배열로 읽어들임
                    byte[] fileContent = inputStream.readAllBytes();

                    // Base64로 인코딩
                    String encodedString = Base64.getEncoder().encodeToString(fileContent);
                    encodingSeries.add(encodedString);
                }
            }
        }
        return ResponseEntity.ok(encodingSeries);
    }

    // 불러온 이미지를 시리즈 단위로 분류 -> Map<시리즈키, List>
    private static Map<Integer, List<Map<String, ?>>> getIntegerListMap(List<Image> images) {
        Map<Integer, List<Map<String, ?>>> groupedBySeries = new HashMap<>();
        for (Image image : images) {
            Map<String, Object> imageInfo = new HashMap<>();
            imageInfo.put("studykey", image.getStudykey());
            imageInfo.put("serieskey", image.getSerieskey());
            imageInfo.put("imagekey", image.getImagekey());
            imageInfo.put("filename", image.getFname());
            imageInfo.put("path", image.getPath() != null ? image.getPath().replace("\\", "/") : null);

            int seriesKey = image.getSerieskey();
            List<Map<String, ?>> seriesImages = groupedBySeries.computeIfAbsent(seriesKey, k -> new ArrayList<>());
            seriesImages.add(imageInfo);
        }
        return groupedBySeries;
    }

    // SMB 경로에서 DICOM 파일의 메타데이터(modality, bodyPart)를 추출 * 사이드바에 활용
    private Map<String, ?> extractDicomMetadata(Map<String, ?> imageInfo, CIFSContext context) {
        String smbFilePath = SMB_URL + imageInfo.get("path") + imageInfo.get("filename");
        Map<String, String> metadata = new HashMap<>();

        try (SmbFile smbFile = new SmbFile(smbFilePath, context);
             SmbFileInputStream smbInputStream = new SmbFileInputStream(smbFile);
             DicomInputStream dicomInputStream = new DicomInputStream(smbInputStream)) {

            if (smbFile.exists() && smbFile.isFile()) {
                Attributes attributes = dicomInputStream.readDataset();
                metadata.put("modality", attributes.getString(Tag.Modality, "<Unknown Modality>"));
                metadata.put("bodyPart", attributes.getString(Tag.BodyPartExamined, "<Unknown BodyPart>"));
                return metadata;
            }
        } catch (IOException e) {
            metadata.put("modality", "<Unknown Modality>");
            metadata.put("bodyPart", "<Unknown BodyPart>");
            return metadata;
        }
        metadata.put("modality", "<Unknown Modality>");
        metadata.put("bodyPart", "<Unknown BodyPart>");
        return metadata; // 파일이 존재하지 않거나 파일이 아닌 경우
    }
}