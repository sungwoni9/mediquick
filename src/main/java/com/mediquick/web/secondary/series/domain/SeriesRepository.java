package com.mediquick.web.secondary.series.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeriesRepository extends JpaRepository<Series, Integer> {
    List<Series> findByStudykey(Integer studykey);
}
