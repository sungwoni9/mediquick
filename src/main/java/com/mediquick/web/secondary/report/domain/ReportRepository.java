package com.mediquick.web.secondary.report.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    Report findTopByStudykeyOrderByReadingdateDesc(int studykey);
}
