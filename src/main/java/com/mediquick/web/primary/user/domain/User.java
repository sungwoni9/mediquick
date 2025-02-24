package com.mediquick.web.primary.user.domain;

import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userrole.domain.UserRole;
import com.mediquick.web.util.Timestamp;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "users")
@Getter
@NoArgsConstructor
public class User extends Timestamp {
    @Id
    @Column(length = 20)
    private String username;

    @Column(length = 255, nullable = false)
    private String password;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @OneToOne(mappedBy = "user")
    private UserInfo userInfo;

    @OneToOne(mappedBy = "user")
    private UserRole userRole;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public void update(UserRequestDto userDto) {
        this.password = userDto.getPassword();
    }

    public void delete() {this.isDeleted = true; }
}
