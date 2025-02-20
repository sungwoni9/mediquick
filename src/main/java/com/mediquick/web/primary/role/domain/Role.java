package com.mediquick.web.primary.role.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "role")
public class Role {

    @Id
    private Byte code;
    private String roleName;
}
