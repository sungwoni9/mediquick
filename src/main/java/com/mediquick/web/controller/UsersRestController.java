package com.mediquick.web.controller;

import com.mediquick.web.primary.user.service.UserService;
import com.mediquick.web.primary.userinfo.service.UserInfoService;
import com.mediquick.web.primary.userrole.service.UserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/user")
@RestController
public class UsersRestController {
    private final UserService userService;
    private final UserInfoService userInfoService;
    private final UserRoleService userRoleService;
}
