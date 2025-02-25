package com.mediquick.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/viewer")
public class ViewerController {

    @GetMapping(value = {"", "/"})
    public String viewer() {
        return "study_viewer/viewer";
    }

    @GetMapping("/sidebar")
    public String sidebar() {
        return "study_viewer/sidebar";
    }

    @GetMapping("/dcm-viewer")
    public String dcmViewer() {
        return "study_viewer/dcmViewer";
    }

    @GetMapping("/viewer-tools")
    public String viewerTools(){
        return "study_viewer/viewerTools";
    }

}
