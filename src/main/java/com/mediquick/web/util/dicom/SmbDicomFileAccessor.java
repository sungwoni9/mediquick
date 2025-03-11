package com.mediquick.web.util.dicom;

import jcifs.CIFSContext;
import jcifs.context.SingletonContext;
import jcifs.smb.NtlmPasswordAuthenticator;
import jcifs.smb.SmbFile;
import jcifs.smb.SmbFileInputStream;
import org.dcm4che3.data.Attributes;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SmbDicomFileAccessor implements DicomFileAccessor {

    @Value("${smb.username}")
    private String username;

    @Value("${smb.password}")
    private String password;

    @Value("${smb.url}")
    private String smbUrl;

    private CIFSContext createContext() {
        NtlmPasswordAuthenticator auth = new NtlmPasswordAuthenticator(username, password);
        return SingletonContext.getInstance().withCredentials(auth);
    }

    @Override
    public byte[] readFileContent(String filePath) throws IOException {
        String fullPath = smbUrl + filePath.replace("\\", "/");
        try (SmbFile smbFile = new SmbFile(fullPath, createContext());
             SmbFileInputStream inputStream = new SmbFileInputStream(smbFile)) {
            return inputStream.readAllBytes();
        }
    }

    @Override
    public Attributes readDicomAttributes(String filePath) throws IOException {
        String fullPath = smbUrl + filePath.replace("\\", "/");
        try (SmbFile smbFile = new SmbFile(fullPath, createContext());
             SmbFileInputStream smbInputStream = new SmbFileInputStream(smbFile);
             DicomInputStream dicomInputStream = new DicomInputStream(smbInputStream)) {
            return dicomInputStream.readDataset();
        }
    }
}
