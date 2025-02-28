package com.mediquick.web.secondary.image.service;

import com.mediquick.web.secondary.image.domain.Image;
import com.mediquick.web.secondary.image.domain.ImageRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ImageService {

    private final ImageRepository imageRepository;

    public List<Image> getImagesByStudyKey(int studykey) {
        return imageRepository.findImageByStudykey(studykey);
    }

    public List<Image> getSeriesImages(int studykey, int serieskey) {
       return imageRepository.findByStudykeyAndSerieskey(studykey,serieskey);
    }

}
