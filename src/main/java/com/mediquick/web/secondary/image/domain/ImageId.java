package com.mediquick.web.secondary.image.domain;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class ImageId implements Serializable {
    private Integer studykey;
    private Integer serieskey;
    private Integer imagekey;
}
