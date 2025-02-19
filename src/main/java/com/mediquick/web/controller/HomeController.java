package com.mediquick.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index(){
        return "index";
    }

    @GetMapping("/header")
    public String header(){
        return "module/header";
    }

    @GetMapping("/footer")
    public String footer(){
        return "module/footer";
    }

    @GetMapping("/error")
    public String error(){
        return "error";
    }

    @GetMapping("/management")
    public String management() {
        return "management";
    }

    @GetMapping("/checkLog")
    public String checkLog() {
        return "checkLog";
    }

    @GetMapping("/logList")
    public String logList() {
        return "logList";
    }
}
