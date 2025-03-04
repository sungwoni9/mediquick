package com.mediquick.web.controller;

import com.mediquick.web.primary.logs.domain.Log;
import com.mediquick.web.primary.logs.service.LogService;
import com.mediquick.web.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequiredArgsConstructor
@RestController
@RequestMapping("/logs")
public class LogRestController {
    private final JwtUtil jwtUtil;
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
    @PostMapping("/viewVideo")
    public ResponseEntity<String> logViewVideo(@RequestHeader("Authorization") String authHeader) {
        // "Bearer <JWT 토큰>" 형식이므로 "Bearer " 부분 제거
        String token = authHeader.replace("Bearer ", "");

        // JWT에서 username 추출
        String username = jwtUtil.extractUsername(token);

        // 로그 저장 (studyKey는 예시 값, 실제로는 클라이언트에서 받아와야 함)
        logService.saveLog(username, Log.ActivityType.VIEW_VIDEO);

        return ResponseEntity.ok("로그 저장 완료");
    }



    // 진료 기록 조회 로그 저장
    @PostMapping("/view-record")
    public void logViewRecord(@RequestParam String username) {
        logService.saveLog(username, Log.ActivityType.VIEW_RECORD);
    }
}
