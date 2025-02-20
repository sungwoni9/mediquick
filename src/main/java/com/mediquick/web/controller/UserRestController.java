package com.mediquick.web.controller;

import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserRegisterRequestDto;
import com.mediquick.web.primary.user.domain.UserRequestDto;
import com.mediquick.web.primary.user.service.UserService;
import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userinfo.service.UserInfoService;
import com.mediquick.web.primary.userrole.domain.UserRole;
import com.mediquick.web.primary.userrole.service.UserRoleService;
import com.mediquick.web.security.JwtUtil;
import com.mediquick.web.util.ResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ResponseDto> validUsername(@RequestParam("value") String username) {
        User user = userService.findByUsername(username);
        System.out.println(username);
        System.out.println(user);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NO_CONTENT.value())
                    .body(new ResponseDto(HttpStatus.NO_CONTENT.value(), "User not found"));
        System.out.println("있음");

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "User validated"));
    }

    @GetMapping("/valid/phone")
    public ResponseEntity<ResponseDto> validPhone(@RequestParam("value") String phone) {
        UserInfo userInfo = userInfoService.findByPhone(phone);
        System.out.println(phone);
        System.out.println(userInfo);
        if (userInfo == null)
            return ResponseEntity.status(HttpStatus.NO_CONTENT.value())
                    .body(new ResponseDto(HttpStatus.NO_CONTENT.value(), "UserInfo not found"));

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "UserInfo validated"));
    }

    @GetMapping("/valid/email")
    public ResponseEntity<ResponseDto> validEmail(@RequestParam("value") String email) {
        UserInfo userInfo = userInfoService.findByEmail(email);

        if (userInfo == null)
            return ResponseEntity.status(HttpStatus.NO_CONTENT.value())
                    .body(new ResponseDto(HttpStatus.NO_CONTENT.value(), "UserInfo not found"));

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "UserInfo validated"));
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto> register(@RequestBody UserRegisterRequestDto userDto) {
        String username = userDto.getUsername();
        String password = userDto.getPassword();
        String name = userDto.getName();
        String phone = userDto.getPhone();
        String email = userDto.getEmail();
        String address = userDto.getAddress();
        String addressDetail = userDto.getAddressDetail();
        String department = userDto.getDepartment();
        String institutionName = userDto.getInstitutionName();
        Byte roleCode = userDto.getRoleCode();

        System.out.println("username: " + username);
        System.out.println("password: " + password);
        System.out.println("name: " + name);
        System.out.println("phone: " + phone);
        System.out.println("email: " + email);
        System.out.println("address: " + address);
        System.out.println("addressDetail: " + addressDetail);
        System.out.println("department: " + department);
        System.out.println("institutionName: " + institutionName);
        System.out.println("roleCode: " + roleCode);


        User user = new User(username,passwordEncoder.encode(password));
        if(!userService.createUser(user))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "User creation failed"));

        UserInfo userInfo = new UserInfo(username,name,phone,email,address,addressDetail,department,institutionName);
        if(!userInfoService.createUserInfo(userInfo))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "UserInfo creation failed"));

        UserRole userRole = new UserRole(username,roleCode);
        if(!userRoleService.createUserRole(userRole))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "UserRole creation failed"));


        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "User registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto> login(@RequestBody UserRequestDto userDto, HttpServletResponse response) {
        try {
            // 사용자 정보 조회
            User user = userService.findByUsername(userDto.getUsername());
            if (user == null || !passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));
            }

            // Spring Security 인증 수행
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));

            // JWT 토큰 생성
            String token = jwtUtil.generateToken(userDto.getUsername());

            // HTTP-Only Cookie에 JWT 저장
            Cookie jwtCookie = new Cookie("jwtToken", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(true); // HTTPS에서만 전송 (개발 환경에서는 false 설정 가능)
            jwtCookie.setPath("/"); // 모든 경로에서 사용 가능
            jwtCookie.setMaxAge(60 * 60); // 1시간 동안 유효

            response.addCookie(jwtCookie);

            return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "Login successful"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseDto> logout(HttpServletResponse response) {
        // 쿠키 삭제 (유효시간 0으로 설정)
        Cookie jwtCookie = new Cookie("jwtToken", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // 즉시 만료

        response.addCookie(jwtCookie);

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "Logged out successfully"));
    }
}
