package com.mediquick.web.primary.role.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "role")
public class Role {

    @Id
    private Byte code;
    private String roleName;
}
