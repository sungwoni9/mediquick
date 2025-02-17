package com.mediquick.web.secondary.study.domain;

import com.mediquick.web.secondary.series.domain.Series;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study,Integer> {
    @Query("SELECT s.studykey FROM Study s")
    List<Series> findByStudykey(Integer studykey);
}
