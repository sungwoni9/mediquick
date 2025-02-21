package com.mediquick.web.primary.logs.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Setter
@Getter
@Entity
@Table(name = "logs")
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long code;

    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type")
    private ActivityType activityType;

    @CreationTimestamp
    private Timestamp regDate;

    public enum ActivityType {
        LOGIN, LOGOUT, VIEW_VIDEO, VIEW_RECORD
    }
}
