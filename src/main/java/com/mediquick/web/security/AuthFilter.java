package com.mediquick.web.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final List<String> PERMIT_ALL_PATHS = Arrays.asList(
            "", "/", "/error",
            "/user/valid/**", "/user/login", "/user/register"
            );
    private final List<String> PROTECTED_PATHS = Arrays.asList(
            "/user/**", "/doctor/**", "/radiologist/**", "/management", "/logList", "/checkLog" );
    // 권한 인증 경로 (SecurityConfig와 동기화 필요)

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String uri = request.getRequestURI();
        String method = request.getMethod();


        if (isPermitAllPath(uri) || !isProtectedPath(uri)) {
            chain.doFilter(request, response);
            return;
        }
        // 권한 인증 필요없는 페이지나 css, js등 파일들을 바로 실행하고 권한 요청이 필요한 것은 밑에서 권한을 얻어야 접근가능

        // 세션에서 토큰 가져오기
        HttpSession session = request.getSession(false);
        String token = getToken(session, request);

        if (token != null) {
            processToken(token, session, request, response);
        } else if (session != null) {
            session.removeAttribute("jwtToken"); // 토큰 없음 시 세션 정리
        }

        chain.doFilter(request, response);
    }

    // 인증이 필요 없는 경로인지 확인
    private boolean isPermitAllPath(String uri) {
        return PERMIT_ALL_PATHS.stream().anyMatch(uri::equals);
    }

    // 보호된 경로인지 확인
    private boolean isProtectedPath(String uri) {
        return PROTECTED_PATHS.stream().anyMatch(path ->
                uri.equals(path) || (path.endsWith("/**") && uri.startsWith(path.substring(0, path.length() - 2)))
        );
    }

    // 세션 또는 헤더에서 토큰 추출
    private String getToken(HttpSession session, HttpServletRequest request) {
        String token = (session != null) ? (String) session.getAttribute("jwtToken") : null;
        if (token == null) {
            token = extractToken(request);
        }
        return token;
    }

    // 토큰 추출 (헤더에서)
    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer ")) ? header.substring(7) : null;
    }

    // 토큰 처리 (검증, 갱신, 인증 설정)
    private void processToken(String token, HttpSession session, HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String username = jwtUtil.extractUsername(token);

            // 토큰이 만료되었을 경우 자동 로그아웃
            if (jwtUtil.isTokenExpired(token)) {
                handleExpiredToken(session, response);
                return;
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                String newToken = jwtUtil.validateAndRefreshToken(token, userDetails);

                if (newToken != null) {
                    setAuthentication(request, userDetails);
                    if (session != null)
                        session.setAttribute("jwtToken", newToken);
                } else if (session != null) {
                    session.removeAttribute("jwtToken");
                }
            }
        } catch (ExpiredJwtException e) {
            handleExpiredToken(session, response);
        } catch (Exception e) {
            if (session != null)
                session.removeAttribute("jwtToken");
        }
    }

    // 만료된 토큰 처리
    private void handleExpiredToken(HttpSession session, HttpServletResponse response) throws IOException {
        if (session != null) {
            session.invalidate(); // 세션 삭제
        }
        SecurityContextHolder.clearContext(); // Spring Security 인증 정보 삭제
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Session expired. Please log in again.");
    }


    // 인증 설정
    private void setAuthentication(HttpServletRequest request, UserDetails userDetails) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
