package com.mediquick.web.primary.user.domain;

import com.mediquick.web.util.Timestamp;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User extends Timestamp {

    @Id
    private String username;
    private String password;
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;  // 기본값 false

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public void update(UserRequestDto userDto) {
        this.password = userDto.getPassword();
    }

    public void delete() {this.isDeleted = true; }
}
