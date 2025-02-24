package com.mediquick.web.secondary.image.service;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.domain.ImageRepository;
import jcifs.CIFSContext;
import jcifs.context.SingletonContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ImageService {

    @Value("${smb.username}")
    private String USERNAME;
    @Value("${smb.password}")
    private String PASSWORD;
    @Value("${smb.url}")
    private String SMB_URL;

    private final ImageRepository imageRepository;

    public List<Image> getImagesByStudyKey(int studykey) {
        return imageRepository.findImageByStudykey(studykey);
    }

    public InputStreamResource getImage(int studykey, int serieskey, int imagekey) throws Exception {
        Image image = imageRepository.findByStudykeyAndSerieskeyAndImagekey(studykey, serieskey, imagekey);

        if (image == null){
            System.out.println("!getImage - 이미지를 찾을 수 없습니다.");
            return null;
        }

        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(USERNAME, PASSWORD);
        CIFSContext baseContext = SingletonContext.getInstance();
        CIFSContext context = baseContext.withCredentials(auth);

        String smbFilePath = SMB_URL + image.getPath().replace("\\", "/") + image.getFname();
        SmbFile smbFile = new SmbFile(smbFilePath, context);

        if (!smbFile.exists() || !smbFile.isFile()) {
            System.out.println("!getImage -SMB 파일을 찾을 수 없습니다.");
            return null;
        }

        // 파일 스트리밍
        SmbFileInputStream inputStream = new SmbFileInputStream(smbFile);
        return new InputStreamResource(inputStream);
    }

}
