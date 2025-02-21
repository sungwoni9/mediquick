package com.mediquick.web.secondary.image.service;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.domain.ImageRepository;
import jcifs.CIFSContext;
import jcifs.context.SingletonContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbFile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ImageService {

    private static final String SMB_URL = "smb://192.168.50.154/STS/";
    private static final String USERNAME = "PACS";
    private static final String PASSWORD = "Sphinx6600";

    private final ImageRepository imageRepository;

    public List<Image> getImagesByStudyKey(int studykey) {
        return imageRepository.findImageByStudykey(studykey);
    }

    public List<SmbFile> getSmbFilesByStudykey(int studykey) throws Exception {
        List<Image> images = imageRepository.findImageByStudykey(studykey);

        if (images == null || images.isEmpty()) {
            return null;
        }

        Map<String, List<String>> pathToFiles = new HashMap<>();

        for (Image image : images) {
            pathToFiles.computeIfAbsent(image.getPath(), k -> new ArrayList<>())
                    .add(image.getFname());
        }

        List<SmbFile> smbFiles = new ArrayList<>();
        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(USERNAME, PASSWORD);

        CIFSContext baseContext = SingletonContext.getInstance();
        CIFSContext context = baseContext.withCredentials(auth);

        for (Map.Entry<String, List<String>> entry : pathToFiles.entrySet()) {
            String path = entry.getKey();
            SmbFile dir = new SmbFile(SMB_URL + path,  context);
            SmbFile[] files = dir.listFiles();
            if (files != null) {
                for (SmbFile file : files) {
                    if (file.isFile() && isDicomFile(file)) {
                        smbFiles.add(file);
                    }
                }
            }
        }

        return smbFiles;
    }

    private boolean isDicomFile(SmbFile file) {
        return file.getName().toLowerCase().endsWith(".dcm");
    }

}
