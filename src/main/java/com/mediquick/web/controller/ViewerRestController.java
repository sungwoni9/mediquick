package com.mediquick.web.controller;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class ViewerRestController {

    private final ImageService imageService;

    public record ImageInfo(String filename, String path) {}

    @GetMapping("/dicom/{studykey}")
    public ResponseEntity<List<ImageInfo>> getDicomMetadata(@PathVariable int studykey) {
        List<Image> images = imageService.getImagesByStudyKey(studykey);

        if (images == null || images.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<ImageInfo> imageInfo = images.stream()
                .map(image -> new ImageInfo(image.getFname(), image.getPath() != null
                        ? image.getPath().replace("\\", "/") : null))
                .collect(Collectors.toList());

        return ResponseEntity.ok(imageInfo);
    }

}



