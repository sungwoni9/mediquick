package com.mediquick.web.security;

import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.userrole.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {
    private final User user;
    private final Byte userRoleCode;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (userRoleCode == null) {
            return Collections.emptyList();
        }

        String roleName = switch (userRoleCode) {
            case 1 -> "ROLE_ADMIN"; // 관리자
            case 2 -> "ROLE_DOCTOR"; // 진료의
            case 3 -> "ROLE_RADIOLOGIST"; // 판독의
            default -> "ROLE_GUEST";
        };

        return List.of(new SimpleGrantedAuthority(roleName));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isEnabled() {
        return !user.getIsDeleted();
    }
}
