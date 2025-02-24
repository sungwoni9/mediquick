package com.mediquick.web.controller;


import com.mediquick.web.primary.userinfo.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping("/user")
@Controller
public class UserController {

        private final UserInfoService userInfoService;

        @GetMapping("/register")
        public String register(){return "user/register";}

        @GetMapping("/login")
        public String login(){return "user/login";}

        @GetMapping("/profile")
        public String profile(){return "user/profile";}

        @GetMapping("/delete")
        public String delete(){return "user/delete";}

}
