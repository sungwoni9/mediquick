package com.mediquick.web.primary.userrole.service;

import com.mediquick.web.primary.userrole.domain.UserRole;
import com.mediquick.web.primary.userrole.domain.UserRoleRepository;
import com.mediquick.web.primary.userrole.domain.UserRoleRequestDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserRoleService {
    private final UserRoleRepository userRoleRepository;

    public Byte getRoleCodeByUsername(String username) {
        UserRole userRole = userRoleRepository.findByUsername(username);
        if(userRole == null)
            return null;
        return userRole.getRoleCode();
    }

    public Boolean createUserRole(UserRole userRole) {
        if(userRoleRepository.findByUsername(userRole.getUsername()) != null)
            return false;

        userRoleRepository.save(userRole);
        return true;
    }

    @Transactional
    public Boolean updateUserRole(UserRoleRequestDto userRoleDto) {
        UserRole userRole = userRoleRepository.findByUsername(userRoleDto.getUsername());
        if(userRole == null)
            return false;

        userRole.update(userRoleDto.getRoleCode());
        return true;
    }
}
