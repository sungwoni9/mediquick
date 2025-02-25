package com.mediquick.web.primary.userinfo.domain;

import com.mediquick.web.primary.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity(name = "user_info")
@Getter
@NoArgsConstructor
public class UserInfo {
    @Id
    @Column(length = 20)
    private String username;

    @OneToOne
    @JoinColumn(name = "username", insertable = false, updatable = false)
    private User user;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(length = 20, nullable = false, unique = true)
    private String phone;

    @Column(length = 255, nullable = false, unique = true)
    private String email;

    @Column(name = "delete_time")
    private Timestamp deleteTime;

    @Column(length = 255, nullable = false)
    private String address;

    @Column(name = "address_detail", length = 255)
    private String addressDetail;

    @Column(length = 50)
    private String department;

    @Column(name = "institution_name", length = 50)
    private String institutionName;

    @Column(name = "mod_date", nullable = false)
    private Timestamp modDate;

    public UserInfo(String username, String name, String phone, String email,
                    String address,String addressDetail, String department, String institutionName) {
        this.username = username;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.addressDetail = addressDetail;
        this.department = department;
        this.institutionName = institutionName;
    }

    public void update(UserInfoRequestDto userInfoDto) {
        this.name = userInfoDto.getName();
        this.phone = userInfoDto.getPhone();
        this.email = userInfoDto.getEmail();
        this.address = userInfoDto.getAddress();
        this.addressDetail = userInfoDto.getAddressDetail();
        this.department = userInfoDto.getDepartment();
        this.institutionName = userInfoDto.getInstitutionName();
    }

    public void delete(){
        this.deleteTime = new Timestamp(System.currentTimeMillis());
    }

    @PrePersist
    public void prePersist() {
        this.modDate = new java.sql.Timestamp(System.currentTimeMillis());
    }

    @PreUpdate
    public void preUpdate() {
        this.modDate = new java.sql.Timestamp(System.currentTimeMillis());
    }
}
