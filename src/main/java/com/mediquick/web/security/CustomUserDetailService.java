package com.mediquick.web.security;

import com.mediquick.web.primary.role.domain.Role;
import com.mediquick.web.primary.role.service.RoleService;
import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.service.UserService;
import com.mediquick.web.primary.userrole.domain.UserRole;
import com.mediquick.web.primary.userrole.service.UserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailService implements UserDetailsService {
    private final UserService usersService;
    private final UserRoleService userRoleService;
    private final RoleService roleService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = usersService.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " +username);
        }

        UserRole userRole  = userRoleService.findByUsername(username);
        if (userRole == null) {
            throw new UsernameNotFoundException("Role not found for user: " + username);
        }

        Role role = roleService.findByCode(userRole.getRoleCode());
        if (role == null) {
            throw new UsernameNotFoundException("Role not found: " + userRole.getRoleCode());
        }

        return new CustomUserDetails(user, role.getRoleName());
    }
}
