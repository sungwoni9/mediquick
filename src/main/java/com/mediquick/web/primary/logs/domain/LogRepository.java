package com.mediquick.web.primary.logs.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {

    // 특정 사용자 로그 조회
    List<Log> findByUsername(String username);

    // 특정 활동 유형별 로그 조회
    List<Log> findByActivityType(Log.ActivityType activityType);
}
