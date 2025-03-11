package com.mediquick.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/viewer")
public class ViewerController {

    @GetMapping(value = {"", "/"})
    public String viewer() {
        return "viewer/viewer";
    }

    @GetMapping("/dcm-sidebar")
    public String sidebar() {
        return "viewer/viewerSidebar";
    }

    @GetMapping("/dcm-render")
    public String dcmViewer() {
        return "viewer/viewerRender";
    }

    @GetMapping("/dcm-tool")
    public String viewerTools(){
        return "viewer/viewerTools";
    }

}
