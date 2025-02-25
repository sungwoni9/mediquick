package com.mediquick.web.security;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("회원가입 인증 코드");
        message.setText("아래 인증 코드를 입력하여 회원가입을 완료하세요:\n" + code);
        mailSender.send(message);
    }
}

//application.datasource.properties에 추가
//# Email
//spring.mail.host=smtp.gmail.com
//spring.mail.port=587
//spring.mail.username=your-email@gmail.com
//spring.mail.password=your-app-password
//spring.mail.properties.mail.smtp.auth=true
//spring.mail.properties.mail.smtp.starttls.enable=true
//
// 이메일 계정 새로 만들어 이메일주소와 비번을 넣든지
// 기존 이메일 계정 사용시 2차인증 설정되어야 하며 계정관리에서
// 검색 > 보안 > 앱 비밀번호 에서 아무 이름 치고 16자리 받아 쓰면됌
