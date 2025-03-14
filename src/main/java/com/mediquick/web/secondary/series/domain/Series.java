package com.mediquick.web.secondary.series.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "seriestab", schema = "pacsplus")
@IdClass(SeriesId.class)
public class Series {

    @Id
    private Integer studykey;
    private Integer serieskey;
    private String studyinsuid;

    @Column(unique=true)
    private String seriesinsuid;
    private Integer seriesnum;
    private String modality;
    private String seriesdate;
    private String seriestime;
    private String bodypart;
    private String seriesdesc;
    private String imagecnt;
    private String delflag;

}
