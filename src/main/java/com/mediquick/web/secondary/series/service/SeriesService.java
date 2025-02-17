package com.mediquick.web.secondary.series.service;

import com.mediquick.web.secondary.series.domain.Series;
import com.mediquick.web.secondary.series.domain.SeriesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SeriesService {
    private final SeriesRepository seriesRepository;

    public List<Series> findSeriesByStudyKey(Integer studykey) {
        return seriesRepository.findByStudykey(studykey);
    }
}
