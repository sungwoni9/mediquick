package com.mediquick.web.secondary.report.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "reporttab", schema = "pacsplus")
public class Report {

    @Id
    private Integer studykey;
    private String readingdrid;
    private String readingdate;

    @Column(length = 256)
    private String studydesc;
    private String modality;

}
