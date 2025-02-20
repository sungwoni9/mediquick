package com.mediquick.web.util;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public class Timestamp {

    @CreatedDate
    @Column(name = "reg_date")
    private java.sql.Timestamp regDate;

    @LastModifiedDate
    @Column(name = "mod_date")
    private java.sql.Timestamp modDate;

    @PrePersist
    public void prePersist() {
        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());
        this.regDate = now;
        this.modDate = now; // `modDate`가 `null`이 되지 않도록 `regDate`와 동일하게 설정
    }

    @PreUpdate
    public void preUpdate() {
        this.modDate = new java.sql.Timestamp(System.currentTimeMillis()); // 업데이트 시 modDate 갱신
    }
}
