package com.mediquick.web.secondary.series.domain;


import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class SeriesId implements Serializable {

    private Integer studykey;
    private Integer serieskey;
}
