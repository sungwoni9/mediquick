package com.mediquick.web.primary.userinfo.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_info")
public class UserInfo {

    @Id
    private String username;
    private String name;
    private String phone;
    private String email;
<<<<<<< HEAD

=======
>>>>>>> origin/feature/users
    @Column(name = "delete_time")
    private Timestamp deleteTime;

    private String address;
<<<<<<< HEAD

=======
>>>>>>> origin/feature/users
    @Column(name = "address_detail")
    private String addressDetail;

    private String department;
<<<<<<< HEAD

=======
>>>>>>> origin/feature/users
    @Column(name = "institution_name")
    private String institutionName;

    @LastModifiedDate
    @Column(name = "mod_date")
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
