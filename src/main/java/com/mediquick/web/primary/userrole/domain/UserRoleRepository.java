package com.mediquick.web.primary.userrole.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    public UserRole findByUsername(String username);
}
