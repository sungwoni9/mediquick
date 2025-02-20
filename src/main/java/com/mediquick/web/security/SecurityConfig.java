package com.mediquick.web.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println(http.toString());
        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화
//                .sessionManagement(AbstractHttpConfigurer::disable) // 세션 비활성화 (Stateless)
                .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll() // 전체 접근 가능
//                    .requestMatchers("/","/user/register", "/user/login").permitAll() // 로그인 없이 접근 가능
//                    .requestMatchers("/user/profile", "/user/delete").authenticated()
//                    .requestMatchers("/management/**","/heckLog/**","/logList/**").hasRole("ADMIN") // 관리자 권한 필요
//                    .anyRequest().authenticated()
                )
                .addFilterBefore(authFilter(), UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
                .formLogin(AbstractHttpConfigurer::disable); // 기본 로그인 폼 비활성화
                //.httpBasic(AbstractHttpConfigurer::disable); // HTTP Basic 인증 비활성화
        System.out.println(http.toString());

        return http.build();
    }

//    @Bean
//    public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
//        StrictHttpFirewall firewall = new StrictHttpFirewall();
//        firewall.setAllowUrlEncodedDoubleSlash(true); // 이중 슬래시 허용
//        return firewall;
//    }

    @Bean
    public AuthFilter authFilter() {
        return new AuthFilter(jwtUtil, userDetailsService);
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
