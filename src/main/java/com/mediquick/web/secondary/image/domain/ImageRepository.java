package com.mediquick.web.secondary.image.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {

    List<Image> findImageByStudykey(int studykey);

    Image findByStudykeyAndSerieskeyAndImagekey(int studykey, int serieskey, int imagekey);
    List<Image> findByStudykeyAndSerieskey(int studykey, int serieskey);
}
