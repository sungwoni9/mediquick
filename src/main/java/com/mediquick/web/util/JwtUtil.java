package com.mediquick.web.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationTime;

    // SecretKey 변환
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        if (keyBytes.length < 32) {
            System.out.println("JWT secret key 길이가 256비트보다 짧음. secret 키를 확인하세요!");
            throw new IllegalArgumentException("JWT secret key must be at least 256 bits (32 bytes)");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }


    // JWT 토큰 생성
    public String generateToken(UserDetails userDetails) {
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    // JWT 토큰에서 사용자명 추출
    public String extractUsername(String token) {
        try {
            return getClaims(token).getSubject(); // `sub` 값이 username이어야 함
        } catch (Exception e) {
            System.out.println("JWT에서 username 추출 실패: " + e.getMessage());
            return null;
        }
    }


    // 기존 유효성 검사 메서드 (갱신 없음)
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            boolean isValid = username.equals(userDetails.getUsername()) && !isTokenExpired(token);
            System.out.println("validateToken() 결과: " + (isValid ? "유효한 토큰" : "유효하지 않은 토큰"));
            return isValid;
        } catch (ExpiredJwtException e) {
            System.out.println("JWT 만료됨: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("JWT 형식 오류: " + e.getMessage());
        } catch (SignatureException e) {
            System.out.println("JWT 서명 오류: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("JWT 검증 실패: " + e.getMessage());
        }
        return false;
    }


    // 유효성 검사 및 갱신 메서드
    public String validateAndRefreshToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            boolean isValid = username.equals(userDetails.getUsername()) && !isTokenExpired(token);

            System.out.println("validateAndRefreshToken() 결과: " + (isValid ? "유효한 토큰" : "유효하지 않은 토큰"));

            if (isValid) {
                return generateToken(userDetails); // 유효하면 새 토큰 생성
            }
        } catch (ExpiredJwtException e) {
            System.out.println("JWT 만료됨: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("JWT 형식 오류: " + e.getMessage());
        } catch (SignatureException e) {
            System.out.println("JWT 서명 오류: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("JWT 검증 실패: " + e.getMessage());
        }
        return null;
    }


    // JWT 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // 만료 시간 추출
    private Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("JWT 파싱 실패: " + e.getMessage());
            return null;
        }
    }


    @GetMapping("/check-login")
    public ResponseEntity<ResponseDto> checkLogin(HttpSession session) {
        String token = (String) session.getAttribute("jwtToken");

        if (token == null || isTokenExpired(token)) {
            session.invalidate(); // 세션 삭제
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Session expired. Please log in again."));
        }

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "Session is active."));
    }

    public long getExpirationTime(String token) {
        return extractExpiration(token).getTime();
    }


}
