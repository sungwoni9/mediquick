package com.mediquick.web.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

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
        byte[] keyBytes = Base64.getDecoder().decode(secret); // Base64 디코딩
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 256 bits (32 bytes)");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    };

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
        return getClaims(token).getSubject();
    }

    // 기존 유효성 검사 메서드 (갱신 없음)
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            System.out.println("JWT 토큰 만료: " + e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            System.out.println("JWT 형식 오류: " + e.getMessage());
            return false;
        } catch (SignatureException e) {
            System.out.println("JWT 서명 오류: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.out.println("JWT 검증 실패: " + e.getMessage());
            return false;
        }
    }

    // 유효성 검사 및 갱신 메서드
    public String validateAndRefreshToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            if (username.equals(userDetails.getUsername()) && !isTokenExpired(token)) {
                // 유효하면 새 토큰 생성
                return generateToken(userDetails);
            }
            return null; // 유효하지 않으면 null 반환
        } catch (ExpiredJwtException e) {
            System.out.println("JWT 토큰 만료: " + e.getMessage());
            return null;
        } catch (MalformedJwtException e) {
            System.out.println("JWT 형식 오류: " + e.getMessage());
            return null;
        } catch (SignatureException e) {
            System.out.println("JWT 서명 오류: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.out.println("JWT 검증 실패: " + e.getMessage());
            return null;
        }
    }

    // JWT 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // 만료 시간 추출
    private Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    private io.jsonwebtoken.Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
