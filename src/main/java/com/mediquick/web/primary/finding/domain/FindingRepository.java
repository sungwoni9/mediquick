package com.mediquick.web.primary.finding.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FindingRepository extends JpaRepository<Finding, Integer> {

}

