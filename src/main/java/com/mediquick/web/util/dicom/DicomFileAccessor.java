package com.mediquick.web.util.dicom;

import java.io.IOException;
import org.dcm4che3.data.Attributes;

public interface DicomFileAccessor {
    byte[] readFileContent(String filePath) throws IOException;
    Attributes readDicomAttributes(String filePath) throws IOException;
}
