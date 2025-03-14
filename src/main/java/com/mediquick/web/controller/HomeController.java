package com.mediquick.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String login(){
        return "/user/login";
    }

    @GetMapping("/header")
    public String header(){
        return "module/header";
    }

    @GetMapping("/headerViewer")
    public String header1(){
        return "module/headerViewer";
    }

    @GetMapping("/footer")
    public String footer(){
        return "module/footer";
    }

    @GetMapping("/error")
    public String error(){
        return "error";
    }

}
