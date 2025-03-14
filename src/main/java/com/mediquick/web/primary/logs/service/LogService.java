package com.mediquick.web.primary.logs.service;

import com.mediquick.web.primary.logs.domain.Log;
import com.mediquick.web.primary.logs.domain.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LogService {
    private final LogRepository logRepository;

    public void saveLog(String username, Log.ActivityType activityType) {
        Log log = new Log();
        log.setUsername(username);
        log.setActivityType(activityType);
        logRepository.save(log);
    }

    public void saveLog(String username, Log.ActivityType activityType, String code) {
        Log log = new Log();
        log.setUsername(username);
        log.setActivityType(activityType);
        log.setStudykey(code);
        logRepository.save(log);
    }

    public List<Log> findLogsByUsername(String username) {
        return logRepository.findByUsername(username);
    }
}
