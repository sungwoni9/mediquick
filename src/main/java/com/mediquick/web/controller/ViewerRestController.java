package com.mediquick.web.controller;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ViewerRestController {

    private final ImageService imageService;

    public record ImageInfo(int studykey, int serieskey, int imagekey, String filename, String path) {}

    @GetMapping("/dicom/{studykey}")
    public ResponseEntity<List<ImageInfo>> getDicomMetadata(@PathVariable int studykey) {
        List<Image> images = imageService.getImagesByStudyKey(studykey);

        if (images == null || images.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<ImageInfo> imageInfo = images.stream()
                .map(image -> new ImageInfo(
                        image.getStudykey(),
                        image.getSerieskey(),
                        image.getImagekey(),
                        image.getFname(),
                        image.getPath() != null ? image.getPath().replace("\\", "/") : null))
                .collect(Collectors.toList());

        return ResponseEntity.ok(imageInfo);
    }


    @Cacheable("dicomFiles")
    @GetMapping("/wado")
    public ResponseEntity<InputStreamResource> getDicomFile(
            @RequestParam("requestType") String requestType,
            @RequestParam("studykey") Integer studykey,
            @RequestParam("serieskey") Integer serieskey,
            @RequestParam("imagekey") Integer imagekey) throws Exception {

        // WADO 요청 확인
        if (!"WADO".equals(requestType) || studykey == null || serieskey == null || imagekey == null) {
            return ResponseEntity.badRequest().build();
        }

        InputStreamResource resource = imageService.getImage(studykey, serieskey, imagekey);

        if (resource == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/dicom"))
                .body(resource);
    }
}



