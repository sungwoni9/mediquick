package com.mediquick.web.primary.user.service;

import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserRepository;
import com.mediquick.web.primary.user.domain.UserRequestDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public boolean createUser(User user) {
        if(userRepository.findUserByUsername(user.getUsername()) != null)
            return false;

        userRepository.save(user);
        return true;
    }

    @Transactional
    public boolean updateUser(UserRequestDto userDto) {
        User user = userRepository.findUserByUsername(userDto.getUsername());

        if(user == null)
            return false;

        user.update(userDto);
        return true;
    }

    @Transactional
    public boolean deleteUser(String username) {
        User user = userRepository.findUserByUsername(username);
        if(user == null)
            return false;

        user.delete();
        return true;
    }
}
