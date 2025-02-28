package com.mediquick.web.controller;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.service.ImageService;
import jcifs.CIFSContext;
import jcifs.context.SingletonContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

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

    // 시리즈별 이미지 목록
    @GetMapping("/dicom/{studykey}/{serieskey}")
    public ResponseEntity<List<ImageInfo>> getSeriesImages(
            @PathVariable int studykey,
            @PathVariable int serieskey) {
        List<Image> images = imageService.getImagesByStudyKey(studykey);

        if (images == null || images.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<ImageInfo> seriesImages = images.stream()
                .filter(image -> image.getSerieskey() == serieskey)
                .map(image -> new ImageInfo(
                        image.getStudykey(),
                        image.getSerieskey(),
                        image.getImagekey(),
                        image.getFname(),
                        image.getPath() != null ? image.getPath().replace("\\", "/") : null))
                .collect(Collectors.toList());

        if (seriesImages.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(seriesImages);
    }


    @GetMapping("/wado")
    public ResponseEntity<List<String>> getDicomSeries(
            @RequestParam("requestType") String requestType,
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

}




