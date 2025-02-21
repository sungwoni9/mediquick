package com.mediquick.web.secondary.image.domain;

import jakarta.persistence.*;
import lombok.Getter;

@IdClass(ImageId.class)
@Table(name = "imagetab", schema = "pacsplus")
@Getter
@Entity
public class Image {

    @Id
    private Integer studykey;

    @Id
    private Integer serieskey;

    @Id
    private Integer imagekey;

    private String studyinsuid;
    private String seriesinsuid;

    @Column(unique = true)
    private String sopinstanceuid;
    private String sopclassuid;
    private Integer ststorageid;
    private String path;
    private String fname;
    private Integer delflag;
}
