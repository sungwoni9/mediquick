package com.mediquick.web.controller;

import com.mediquick.web.primary.logs.domain.Log;
import com.mediquick.web.primary.logs.domain.LogRequestDto;
import com.mediquick.web.primary.logs.service.LogService;
import com.mediquick.web.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.security.SignatureException;

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
    @PostMapping("/view-video")
    public ResponseEntity<String> logViewVideo(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody LogRequestDto request) {
        System.out.println("요청 수신: /view-video, studykey : " + request.getStudyKey());
        System.out.println("Authorization 헤더 값: " + authHeader);

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Authorization 헤더가 올바르지 않음!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization header missing or invalid format");
            }

            String token = authHeader.replace("Bearer ", "");
            System.out.println("추출된 JWT 토큰: " + token);

            // JWT에서 username 추출
            String username = jwtUtil.extractUsername(token);
            System.out.println("추출된 username: " + username);

            if (username == null || username.isEmpty()) {
                System.out.println("JWT 검증 실패: 유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            logService.saveLog(username, Log.ActivityType.VIEW_VIDEO, request.getStudyKey());
            return ResponseEntity.ok("로그 저장 완료");

        } catch (ExpiredJwtException e) {
            System.out.println("JWT 토큰이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT 토큰이 만료되었습니다.");
        } catch (MalformedJwtException e) {
            System.out.println("JWT 형식이 올바르지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT 형식이 올바르지 않습니다.");
        } catch (Exception e) {
            System.out.println("JWT 검증 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT 검증 실패: " + e.getMessage());
        }
    }


    // 진료 기록 조회 로그 저장
    @PostMapping("/view-record")
    public ResponseEntity<String> logViewRecord(@RequestHeader("Authorization") String authHeader,
                                                @RequestBody LogRequestDto request) {
        System.out.println("요청 수신: /view-record, studyKey : " + request.getStudyKey());
        System.out.println("Authorization 헤더 값: " + authHeader);

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Authorization 헤더가 올바르지 않음!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authorization header missing or invalid format");
            }

            String token = authHeader.replace("Bearer ", "");
            System.out.println("추출된 JWT 토큰: " + token);

            // JWT에서 username 추출
            String username = jwtUtil.extractUsername(token);
            System.out.println("추출된 username: " + username);

            if (username == null || username.isEmpty()) {
                System.out.println("JWT 검증 실패: 유효하지 않은 토큰");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
            }

            logService.saveLog(username, Log.ActivityType.VIEW_RECORD, request.getStudyKey());
            return ResponseEntity.ok("진료 기록 조회 로그 저장 완료");

        } catch (ExpiredJwtException e) {
            System.out.println("JWT 토큰이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT 토큰이 만료되었습니다.");
        } catch (MalformedJwtException e) {
            System.out.println("JWT 형식이 올바르지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT 형식이 올바르지 않습니다.");
        } catch (Exception e) {
            System.out.println("JWT 검증 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("JWT 검증 실패: " + e.getMessage());
        }
    }

}
