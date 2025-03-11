package com.mediquick.web.util.dicom;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DefaultDicomMetadataExtractor implements DicomMetadataExtractor{
    @Override
    public Map<String, String> extractOverlayMetadata(Attributes attributes) {
        Map<String, String> metadata = new HashMap<>();
        System.out.println(attributes.getString(Tag.PatientName, "Unknown"));
        metadata.put("patientName", attributes.getString(Tag.PatientName, "Unknown"));
        metadata.put("patientID", attributes.getString(Tag.PatientID, "Unknown"));
        metadata.put("modality", attributes.getString(Tag.Modality, "Unknown"));
        metadata.put("studyDate", attributes.getString(Tag.StudyDate, "Unknown"));
        metadata.put("studyDescription", attributes.getString(Tag.StudyDescription, "Unknown"));
        metadata.put("seriesNumber", attributes.getString(Tag.SeriesNumber, "Unknown"));
        metadata.put("bodyPart", attributes.getString(Tag.BodyPartExamined, "Unknown"));
        metadata.put("institutionName", attributes.getString(Tag.InstitutionName, "Unknown"));
        metadata.put("sliceThickness", attributes.getString(Tag.SliceThickness, "Unknown"));
        return metadata;
    }

    @Override
    public Map<String, String> extractSidebarMetadata(Attributes attributes) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("modality", attributes.getString(Tag.Modality, "<Unknown Modality>"));
        metadata.put("bodyPart", attributes.getString(Tag.BodyPartExamined, "<Unknown BodyPart>"));
        return metadata;
    }
}
