package com.mediquick.web.primary.role.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Byte> {
    public Role findByCode(Byte code);
}
