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

    public record ImageInfo(int studykey, int serieskey, int imagekey, String filename, String path) {
    }

    public record SeriesImages(int studykey, int serieskey, List<ImageInfo> images, int imageCount, String modality,
                               String bodyPart) {
    }

    public record DicomMetadata(String modality, String bodyPart) {
    }


    // 지정된 studykey 에 속한 시리즈별 이미지 메타데이터를 반환
    @GetMapping("/dicom/{studykey}")
    public ResponseEntity<List<SeriesImages>> getDicomMetadataBySeries(@PathVariable("studykey") int studykey) {
        List<Image> images = imageService.getImagesByStudyKey(studykey);

        if (images == null || images.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(USERNAME, PASSWORD);
        CIFSContext baseContext = SingletonContext.getInstance();
        CIFSContext context = baseContext.withCredentials(auth);

        // 시리즈별로 이미지 그룹화
        Map<Integer, List<ImageInfo>> groupedBySeries = getIntegerListMap(images);

        // SeriesImages 리스트 생성
        List<SeriesImages> seriesImagesList = new ArrayList<>();
        for (Map.Entry<Integer, List<ImageInfo>> entry : groupedBySeries.entrySet()) {
            int seriesKey = entry.getKey();
            List<ImageInfo> imageInfos = entry.getValue();

            // 시리즈에서 첫 번째 파일의 메타데이터 추출
            ImageInfo firstImage = imageInfos.get(0);
            DicomMetadata metadata = extractDicomMetadata(firstImage, context);

            SeriesImages seriesImages = new SeriesImages(
                    studykey,
                    seriesKey,
                    imageInfos,
                    imageInfos.size(),
                    metadata.modality(),
                    metadata.bodyPart()
            );
            seriesImagesList.add(seriesImages);
        }

        // 시리즈 키 기준으로 정렬
        seriesImagesList.sort(Comparator.comparingInt(SeriesImages::serieskey));

        return ResponseEntity.ok(seriesImagesList);
    }

    // 지정된 studykey 와 serieskey 에 해당하는 이미지 정보를 반환
    @GetMapping("/dicom/{studykey}/{serieskey}")
    public ResponseEntity<List<ImageInfo>> getSeriesImages(@PathVariable("studykey") int studykey, @PathVariable("serieskey") int serieskey) {

        if (serieskey < 0) {
            return ResponseEntity.badRequest().build();
        }

        List<Image> images = imageService.getImagesByStudyKey(studykey);

        if (images == null || images.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // 시리즈 키에 맞는 이미지 필터링 및 변환
        List<ImageInfo> seriesImages = getImageInfos(serieskey, images);

        if (seriesImages.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(seriesImages);
    }

    // WADO 요청으로 지정된 시리즈의 DICOM 파일을 Base64로 인코딩하여 반환
    @GetMapping("/wado")
    public ResponseEntity<List<String>> getDicomSeries(@RequestParam("requestType") String requestType,
                                                       @RequestParam("studykey") Integer studykey,
                                                       @RequestParam("serieskey") Integer serieskey) throws IOException {

        if (!"WADO".equals(requestType) || studykey == null || serieskey == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Image> images = imageService.getSeriesImages(studykey, serieskey);

        if (images == null) {
            return ResponseEntity.notFound().build();
        }

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

    // 주어진 serieskey 에 해당하는 이미지 정보를 필터링하여 리스트로 반환
    private static List<ImageInfo> getImageInfos(int serieskey, List<Image> images) {
        List<ImageInfo> seriesImages = new ArrayList<>(images.size());
        for (Image image : images) {
            if (image.getSerieskey() == serieskey) {
                ImageInfo imageInfo = new ImageInfo(
                        image.getStudykey(),
                        image.getSerieskey(),
                        image.getImagekey(),
                        image.getFname(),
                        image.getPath() != null ? image.getPath().replace("\\", "/") : null
                );
                seriesImages.add(imageInfo);
            }
        }
        return seriesImages;
    }

    // 이미지 리스트를 시리즈 키별로 그룹화하여 맵으로 반환
    private static Map<Integer, List<ImageInfo>> getIntegerListMap(List<Image> images) {
        Map<Integer, List<ImageInfo>> groupedBySeries = new HashMap<>();
        for (Image image : images) {
            ImageInfo imageInfo = new ImageInfo(
                    image.getStudykey(),
                    image.getSerieskey(),
                    image.getImagekey(),
                    image.getFname(),
                    image.getPath() != null ? image.getPath().replace("\\", "/") : null
            );

            int seriesKey = imageInfo.serieskey();
            List<ImageInfo> seriesImages = groupedBySeries.computeIfAbsent(seriesKey, k -> new ArrayList<>());
            seriesImages.add(imageInfo);
        }
        return groupedBySeries;
    }

    // SMB 경로에서 DICOM 파일의 메타데이터(modality, bodyPart)를 추출
    private DicomMetadata extractDicomMetadata(ImageInfo imageInfo, CIFSContext context) {
        String smbFilePath = SMB_URL + imageInfo.path() + "/" + imageInfo.filename();
        try (SmbFile smbFile = new SmbFile(smbFilePath, context);
             SmbFileInputStream smbInputStream = new SmbFileInputStream(smbFile);
             DicomInputStream dicomInputStream = new DicomInputStream(smbInputStream)) {

            if (smbFile.exists() && smbFile.isFile()) {
                Attributes attributes = dicomInputStream.readDataset();
                String modality = attributes.getString(Tag.Modality, "<Unknown Modality>");
                String bodyPart = attributes.getString(Tag.BodyPartExamined, "<Unknown BodyPart>");
                return new DicomMetadata(modality, bodyPart);
            }
        } catch (IOException e) {
            return new DicomMetadata("<Unknown Modality>", "<Unknown BodyPart>");
        }
        return new DicomMetadata("<Unknown Modality>", "<Unknown BodyPart>"); // 파일이 존재하지 않거나 파일이 아닌 경우
    }

}




