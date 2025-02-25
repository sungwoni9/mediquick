package com.mediquick.web.controller;

import com.mediquick.web.primary.logs.domain.Log;
import com.mediquick.web.primary.logs.service.LogService;
import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserDetailsDto;
import com.mediquick.web.primary.user.domain.UserRegisterDto;
import com.mediquick.web.primary.user.domain.UserRequestDto;
import com.mediquick.web.primary.user.service.UserService;
import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.user.domain.UserInfoDto;
import com.mediquick.web.primary.userinfo.domain.UserInfoRequestDto;
import com.mediquick.web.primary.userinfo.service.UserInfoService;
import com.mediquick.web.primary.userrole.domain.UserRole;
import com.mediquick.web.primary.userrole.domain.UserRoleRequestDto;
import com.mediquick.web.primary.userrole.service.UserRoleService;
import com.mediquick.web.security.EmailService;
import com.mediquick.web.security.JwtUtil;
import com.mediquick.web.util.ResponseDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
public class UserRestController {
    private final UserService userService;
    private final UserInfoService userInfoService;
    private final UserRoleService userRoleService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final LogService logService;
    private final EmailService emailService;

    @GetMapping("/valid/username")
    public ResponseEntity<ResponseDto> validUsername(@RequestParam("value") String username) {
        User user = userService.findByUsername(username);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NO_CONTENT.value())
                    .body(new ResponseDto(HttpStatus.NO_CONTENT.value(), "User not found"));

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "User validated"));
    }

    @GetMapping("/valid/phone")
    public ResponseEntity<ResponseDto> validPhone(@RequestParam("value") String phone) {
        UserInfo userInfo = userInfoService.findByPhone(phone);

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

    // 인증코드 발송
    @GetMapping("/valid/send")
    public ResponseEntity<ResponseDto> sendCode(@RequestParam("email") String email,HttpSession session) {
        String verifyCode = String.format("%06d", new Random().nextInt(999999));

        session.setAttribute("verifyCode", verifyCode);
        session.setAttribute("verifiedEmail", email);

        // 이메일 전송
        emailService.sendVerificationCode(email, verifyCode);
        System.out.println("전송완료");
        
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "Verification code sent"));
    }

    // 인증코드 확인
    @GetMapping("/valid/verify")
    public ResponseEntity<ResponseDto> sendCode(@RequestParam("email") String email,@RequestParam("code") String code, HttpSession session) {
        String sessionCode = (String) session.getAttribute("verifyCode");
        String verifiedEmail = (String) session.getAttribute("verifiedEmail");

        if (!sessionCode.equals(code)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "Invalid verification code"));
        }
        if (!verifiedEmail.equals(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "Email has been changed. Please reverify."));
        }

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "Email verification successful."));
    }

    @GetMapping("/valid/info")
    public ResponseEntity<ResponseDto> userInfo(HttpSession session) {
        String token = (String) session.getAttribute("jwtToken");
        if (token == null) {
            System.out.println("null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Unauthorized"));
        }
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (!jwtUtil.validateToken(token, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid token"));
            }
            UserInfoDto userInfoDto = userService.findUserInfoByUsername(username);
            if (userInfoDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDto(HttpStatus.NOT_FOUND.value(), "User info not found"));
            }
            return ResponseEntity.ok(userInfoDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid token"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDto> register(@RequestBody UserRegisterDto userDto) {
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
    public ResponseEntity<ResponseDto> login(@RequestBody UserRequestDto userDto, HttpSession session) {
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

            // UserDetails 로드
            UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getUsername());
            // 로그인 로그 저장
            logService.saveLog(userDto.getUsername(), Log.ActivityType.LOGIN);
            // JWT 토큰 생성
            String token = jwtUtil.generateToken(userDetails);

            session.setAttribute("jwtToken", token);
            return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"));
        }
    }

    @GetMapping("/myaccount")
    public ResponseEntity<ResponseDto> myAccount(HttpSession session) {
        String token = (String) session.getAttribute("jwtToken");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Unauthorized"));
        }
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (!jwtUtil.validateToken(token, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid token"));
            }
            UserDetailsDto userDetailsDto = userService.findUserDetailsByUsername(username);
            if (userDetailsDto == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDto(HttpStatus.NOT_FOUND.value(), "User details not found"));
            }
            return ResponseEntity.ok(userDetailsDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid token"));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseDto> update(@RequestBody UserRegisterDto userDto, HttpSession session) {
        String token = (String) session.getAttribute("jwtToken");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Unauthorized - token : null"));
        }
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (!jwtUtil.validateToken(token, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid token"));
            }

            String password = userDto.getPassword();
            String name = userDto.getName();
            String phone = userDto.getPhone();
            String email = userDto.getEmail();
            String address = userDto.getAddress();
            String addressDetail = userDto.getAddressDetail();
            String department = userDto.getDepartment();
            String institutionName = userDto.getInstitutionName();
            Byte roleCode = userDto.getRoleCode();

            if(!password.isEmpty()){
                UserRequestDto user = new UserRequestDto(username,passwordEncoder.encode(password));
                if(!userService.updateUser(user))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                            .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "User update failed"));
            }

            UserInfoRequestDto userInfo = new UserInfoRequestDto(username,name,phone,email,address,addressDetail,department,institutionName);
            if(!userInfoService.updateUserInfo(userInfo))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                        .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "UserInfo update failed"));

            if(roleCode!=null) {
                UserRoleRequestDto userRole = new UserRoleRequestDto(username, roleCode);
                if (!userRoleService.updateUserRole(userRole))
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                            .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "UserRole update failed"));
            }

            return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "User updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<ResponseDto> logout(HttpSession session) {
        session.removeAttribute("jwtToken");
        session.invalidate();
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "Logged out successfully"));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ResponseDto> delete(@RequestBody UserRegisterDto userDto, HttpSession session) {
        String token = (String) session.getAttribute("jwtToken");
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Unauthorized"));
        }
        try {
            String username = jwtUtil.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (!jwtUtil.validateToken(token, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid token"));
            }
            User user = userService.findByUsername(username);
            if (user == null || !passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ResponseDto(HttpStatus.UNAUTHORIZED.value(), "Invalid password"));
            }
            // 사용자 삭제 로직
            if(userService.deleteUser(username)) {
                session.removeAttribute("jwtToken");
                session.invalidate(); // 세션 무효화
                return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "User deleted successfully"));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDto(HttpStatus.NOT_FOUND.value(), "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Deletion failed"));
        }
    }

}
