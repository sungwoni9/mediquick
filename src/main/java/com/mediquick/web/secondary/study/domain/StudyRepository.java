package com.mediquick.web.secondary.study.domain;

import com.mediquick.web.secondary.series.domain.Series;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyRepository extends JpaRepository<Study,Integer> {
    @Query("SELECT s.studykey FROM Study s")
    List<Series> findByStudykey(Integer studykey);

    List<Study> findByPid(String pid);

    // studykey 기준 오름차순으로 모든 Study 가져오기
    List<Study> findAll(Sort sort);
}
