package com.mediquick.web.primary.user.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    public User findByUsername(String username);
    public User findByUsernameAndIsDeletedFalse(String username);
}
