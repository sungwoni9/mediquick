package com.mediquick.web.primary.userinfo.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, String> {
    public UserInfo findByUsername(String username);

    public UserInfo findByPhone(String phone);

    public UserInfo findByEmail(String email);
}
