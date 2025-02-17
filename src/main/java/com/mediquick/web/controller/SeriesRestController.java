package com.mediquick.web.controller;

import com.mediquick.web.secondary.series.domain.Series;
import com.mediquick.web.secondary.series.service.SeriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("series")
@RestController
public class SeriesRestController {

    private final SeriesService seriesService;

    @GetMapping("/{studykey}")
    public ResponseEntity<List<Series>> getSeriesByStudyKey(@PathVariable Integer studykey) {
        List<Series> seriesList = seriesService.findSeriesByStudyKey(studykey);

        if(seriesList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(seriesList);
    }
}
