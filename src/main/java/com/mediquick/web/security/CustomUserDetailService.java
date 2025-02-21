package com.mediquick.web.security;

import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserRepository;
import com.mediquick.web.primary.user.service.UserService;
import com.mediquick.web.primary.userrole.domain.UserRole;
import com.mediquick.web.primary.userrole.domain.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailService implements UserDetailsService {
    private final UserService userService;
    private final UserRoleRepository userRoleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }

        UserRole userRole  = userRoleRepository.findByUsername(user.getUsername());
        Byte userRoleCode = (userRole != null) ? userRole.getRoleCode() : 0;

        return new CustomUserDetails(user, userRoleCode);
    }
}
