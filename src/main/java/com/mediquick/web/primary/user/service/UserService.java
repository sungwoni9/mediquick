package com.mediquick.web.primary.user.service;

import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserRepository;
import com.mediquick.web.primary.user.domain.UserRequestDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private UserRepository userRepository;

    public boolean createUser(User user) {
        if(userRepository.findByUsername(user.getUsername()) != null)
            return false;

        userRepository.save(user);
        return true;
    }

    @Transactional
    public boolean updateUser(UserRequestDto userDto) {
        User user = userRepository.findByUsername(userDto.getUsername());

        if(user == null)
            return false;

        user.update(userDto);
        return true;
    }

    @Transactional
    public boolean deleteUser(String username) {
        User user = userRepository.findByUsername(username);
        if(user == null)
            return false;

        user.delete();
        return true;
    }
}
