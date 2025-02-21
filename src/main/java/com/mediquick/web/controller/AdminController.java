package com.mediquick.web.controller;

import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userinfo.service.UserInfoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class AdminController {

    private final UserInfoService userInfoService;

    public AdminController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    @GetMapping("/management")
    public String management() {
        return "management";
    }

    @GetMapping("/logList")
    public String logList() {
        return "logList";
    }

    @GetMapping("/checkLog")
    public String getAllUsers(Model model) {

        List<UserInfo> users = userInfoService.findAll();

        System.out.println("조회된 사용자 수: " + users.size());

        model.addAttribute("users", users);
        return "checkLog";
    }

}
