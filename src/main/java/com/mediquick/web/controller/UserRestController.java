package com.mediquick.web.controller;

import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserRequestDto;
import com.mediquick.web.primary.user.service.UserService;
import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userinfo.service.UserInfoService;
import com.mediquick.web.primary.userrole.service.UserRoleService;
import com.mediquick.web.security.JwtUtil;
import com.mediquick.web.util.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("user")
@RestController
public class UserRestController {
    private final UserService userService;
    private final UserInfoService userInfoService;
    private final UserRoleService userRoleService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/valid/username")
    public ResponseEntity<ResponseDto> validUsername(@RequestParam("username") String username) {
        User user = userService.findUserByUsername(username);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND.value())
                    .body(new ResponseDto(HttpStatus.NOT_FOUND.value(), "User not found"));

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "User validated"));
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto> register(@RequestBody UserRequestDto userDto) {
        String username = userDto.getUsername();
        String password = userDto.getPassword();

        User user = new User(username,passwordEncoder.encode(password));
        System.out.println("username: " + username + " password: " + password);
        System.out.println("username: " + user.getUsername() + " password: " + user.getPassword());
        if(!userService.createUser(user))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "User creation failed"));

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "User registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto> login(@RequestBody UserRequestDto userDto) {
        try {
            // 사용자 정보 조회
            User user = userService.findUserByUsername(userDto.getUsername());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));
            }

            // 입력된 비밀번호와 암호화된 비밀번호 비교
            if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));
            }

            // Spring Security 인증 수행
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));

            // JWT 토큰 생성
            String token = jwtUtil.generateToken(userDto.getUsername());

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + token)
                    .body(new ResponseDto(HttpStatus.OK.value(), "Login successful"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));
        }
    }
}
