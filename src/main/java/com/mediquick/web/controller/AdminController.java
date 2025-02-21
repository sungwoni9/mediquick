package com.mediquick.web.controller;

import com.mediquick.web.primary.logs.domain.Log;
import com.mediquick.web.primary.logs.service.LogService;
import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userinfo.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class AdminController {

    private final UserInfoService userInfoService;
    private final LogService logService;

    @GetMapping("/management")
    public String management() {
        return "management";
    }

    @GetMapping("/logList")
    public String getUserLogs(@RequestParam String username, Model model) {

        List<Log> logs = logService.findLogsByUsername(username);

        model.addAttribute("logs", logs);

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
