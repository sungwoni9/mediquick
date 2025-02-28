package com.mediquick.web.controller;

import com.mediquick.web.primary.logs.domain.Log;
import com.mediquick.web.primary.logs.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequiredArgsConstructor
@RestController
@RequestMapping("/logs")
public class LogRestController {

    private final LogService logService;

    // 로그인 로그 저장
    @PostMapping("/login")
    public void logLogin(@RequestParam String username) {
        logService.saveLog(username, Log.ActivityType.LOGIN);
    }

    // 로그아웃 로그 저장
    @PostMapping("/logout")
    public void logLogout(@RequestParam String username) {
        logService.saveLog(username, Log.ActivityType.LOGOUT);
    }

    // 영상 조회 로그 저장
    @PostMapping("/view-video")
    public ResponseEntity<String> logViewVideo(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자가 로그인되지 않음");
        }
        String username = principal.getName();
        logService.saveLog(username, Log.ActivityType.VIEW_VIDEO);
        return ResponseEntity.ok("로그 저장 완료");
    }


    // 진료 기록 조회 로그 저장
    @PostMapping("/view-record")
    public void logViewRecord(@RequestParam String username) {
        logService.saveLog(username, Log.ActivityType.VIEW_RECORD);
    }
}
