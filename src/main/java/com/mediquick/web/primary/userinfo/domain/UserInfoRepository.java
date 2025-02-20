package com.mediquick.web.primary.userinfo.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    public UserInfo findByUsername(String username);
}
