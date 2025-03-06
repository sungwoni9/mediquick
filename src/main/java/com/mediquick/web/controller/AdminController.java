package com.mediquick.web.controller;

import com.mediquick.web.primary.logs.domain.Log;
import com.mediquick.web.primary.logs.service.LogService;
import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserDetailsDto;
import com.mediquick.web.primary.user.domain.UserRepository;
import com.mediquick.web.primary.user.service.UserService;
import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userinfo.service.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class AdminController {

    private final UserRepository userRepository;
    private final UserInfoService userInfoService;
    private final LogService logService;
    private final UserService userService;

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

    @GetMapping("/userList")
    public String getUsers(Model model) {
        List<UserDetailsDto> users = userRepository.findAll()
                .stream()
                .map(user -> userRepository.findUserDetailsDtoByUsername(user.getUsername()))
                .toList();

        model.addAttribute("userList", users);
        return "userList";
    }

    @PostMapping("/deleteByManager")
    public String deleteByManager(@RequestParam("username") String username, RedirectAttributes redirectAttributes) {
        userService.deleteUser(username);

        // 삭제 후 사용자 목록 페이지로 이동
        redirectAttributes.addFlashAttribute("message", "사용자가 삭제되었습니다.");
        return "redirect:/userList";
    }
}
