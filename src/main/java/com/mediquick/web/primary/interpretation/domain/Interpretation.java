package com.mediquick.web.primary.interpretation.domain;

import com.mediquick.web.util.Timestamp;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
@Table(name = "interpretation")
public class Interpretation extends Timestamp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer code;
    private String username;
    private int studykey;

    public Interpretation(String username, int studykey) {
        this.username = username;
        this.studykey = studykey;
    }
}
