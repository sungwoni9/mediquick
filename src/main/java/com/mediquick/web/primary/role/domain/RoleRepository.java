package com.mediquick.web.primary.role.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    public Role findByCode(Byte code);
}
