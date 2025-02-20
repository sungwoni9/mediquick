package com.mediquick.web.primary.role.service;

import com.mediquick.web.primary.role.domain.Role;
import com.mediquick.web.primary.role.domain.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role findByCode(Byte Code) {
        return roleRepository.findByCode(Code);
    }
}
