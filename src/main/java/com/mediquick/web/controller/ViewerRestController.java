package com.mediquick.web.controller;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.service.ImageService;
import com.mediquick.web.util.dicom.DicomFileAccessor;
import com.mediquick.web.util.dicom.DicomMetadataExtractor;
import lombok.RequiredArgsConstructor;
import org.dcm4che3.data.Attributes;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ViewerRestController {
    private final ImageService imageService;
    private final DicomFileAccessor dicomFileAccessor;
    private final DicomMetadataExtractor metadataExtractor;

    @GetMapping("/dicom/{studykey}")
    public ResponseEntity<List<Map<String, ?>>> getDicomMetadataBySeries(@PathVariable("studykey") int studykey) {
        List<Image> images = imageService.getImagesByStudyKey(studykey);
        if (images == null || images.isEmpty()) return ResponseEntity.noContent().build();

        Map<Integer, List<Map<String, ?>>> groupedBySeries = groupImagesBySeries(images);
        List<Map<String, ?>> seriesImagesList = buildSeriesMetadata(groupedBySeries, studykey);
        seriesImagesList.sort(Comparator.comparingInt(m -> (int) m.get("serieskey")));
        return ResponseEntity.ok(seriesImagesList);
    }

    @GetMapping("/dicom/{studykey}/{serieskey}")
    public ResponseEntity<?> getSeriesImages(@PathVariable("studykey") int studykey, @PathVariable("serieskey") int serieskey) {
        if (studykey < 1 || serieskey < 1) return ResponseEntity.badRequest().build();

        List<Image> images = imageService.getSeriesImages(studykey, serieskey);
        if (images == null || images.isEmpty()) return ResponseEntity.noContent().build();

        Image firstImage = images.get(0);
        String filePath = firstImage.getPath().replace("\\", "/") + firstImage.getFname();

        try {
            Attributes attributes = dicomFileAccessor.readDicomAttributes(filePath);
            Map<String, String> overlayData = metadataExtractor.extractOverlayMetadata(attributes);
            return ResponseEntity.ok(overlayData);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("DICOM 파일 처리 중 오류: " + e.getMessage());
        }
    }

    @GetMapping("/wado")
    public ResponseEntity<List<String>> getDicomSeries(@RequestParam("studykey") Integer studykey, @RequestParam("serieskey") Integer serieskey) throws IOException {
        if (studykey == null || serieskey == null) return ResponseEntity.badRequest().build();

        List<Image> images = imageService.getSeriesImages(studykey, serieskey);
        if (images == null || images.isEmpty()) return ResponseEntity.notFound().build();

        List<String> encodedSeries = new ArrayList<>();
        for (Image image : images) {
            String filePath = image.getPath().replace("\\", "/") + image.getFname();
            byte[] fileContent = dicomFileAccessor.readFileContent(filePath);
            String encodedString = Base64.getEncoder().encodeToString(fileContent);
            encodedSeries.add(encodedString);
        }
        return ResponseEntity.ok(encodedSeries);
    }

    private Map<Integer, List<Map<String, ?>>> groupImagesBySeries(List<Image> images) {
        Map<Integer, List<Map<String, ?>>> groupedBySeries = new HashMap<>();
        for (Image image : images) {
            Map<String, Object> imageInfo = new HashMap<>();
            imageInfo.put("studykey", image.getStudykey());
            imageInfo.put("serieskey", image.getSerieskey());
            imageInfo.put("imagekey", image.getImagekey());
            imageInfo.put("filename", image.getFname());
            imageInfo.put("path", image.getPath() != null ? image.getPath().replace("\\", "/") : null);

            groupedBySeries.computeIfAbsent(image.getSerieskey(), k -> new ArrayList<>()).add(imageInfo);
        }
        return groupedBySeries;
    }

    private List<Map<String, ?>> buildSeriesMetadata(Map<Integer, List<Map<String, ?>>> groupedBySeries, int studykey) {
        List<Map<String, ?>> seriesImagesList = new ArrayList<>();
        for (Map.Entry<Integer, List<Map<String, ?>>> entry : groupedBySeries.entrySet()) {
            int seriesKey = entry.getKey();
            List<Map<String, ?>> imageInfos = entry.getValue();
            Map<String, ?> firstImage = imageInfos.get(0);
            String filePath = (String) firstImage.get("path") + firstImage.get("filename");

            Map<String, String> metadata;
            try {
                Attributes attributes = dicomFileAccessor.readDicomAttributes(filePath);
                metadata = metadataExtractor.extractSidebarMetadata(attributes);
            } catch (IOException e) {
                metadata = Map.of("modality", "<Unknown Modality>", "bodyPart", "<Unknown BodyPart>");
            }

            Map<String, Object> seriesImages = new HashMap<>();
            seriesImages.put("studykey", studykey);
            seriesImages.put("serieskey", seriesKey);
            seriesImages.put("images", imageInfos);
            seriesImages.put("imageCount", imageInfos.size());
            seriesImages.put("modality", metadata.get("modality"));
            seriesImages.put("bodyPart", metadata.get("bodyPart"));
            seriesImagesList.add(seriesImages);
        }
        return seriesImagesList;
    }
}