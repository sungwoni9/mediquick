package com.mediquick.web.util.dicom;

import java.util.Map;
import org.dcm4che3.data.Attributes;

public interface DicomMetadataExtractor {
    Map<String, String> extractOverlayMetadata(Attributes attributes);
    Map<String, String> extractSidebarMetadata(Attributes attributes);
}
