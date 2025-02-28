package com.mediquick.web.primary.user.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, String> {
    public User findByUsername(String username);

    @Query("SELECT new com.mediquick.web.primary.user.domain.UserDetailsDto(" +
            "u.username, u.password, u.isDeleted, u.regDate, u.modDate, " +
            "ui.name, ui.phone, ui.email, ui.address, ui.addressDetail, " +
            "ui.department, ui.institutionName, ui.deleteTime, ui.modDate, " +
            "ur.roleCode) " +
            "FROM users u " +
            "LEFT JOIN u.userInfo ui " +
            "LEFT JOIN u.userRole ur " +
            "WHERE u.username = ?1")
    public UserDetailsDto findUserDetailsDtoByUsername(String username);



    @Query("SELECT new com.mediquick.web.primary.user.domain.UserInfoDto(" +
            "u.userInfo.name, u.userInfo.department, u.userInfo.institutionName, u.userRole.roleCode) " +
            "FROM users u " +
            "WHERE u.username = ?1")
    public UserInfoDto findUserInfoDtoByUsername(String username);
}
