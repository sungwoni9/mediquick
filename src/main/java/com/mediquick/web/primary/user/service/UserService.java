package com.mediquick.web.primary.user.service;

import com.mediquick.web.primary.user.domain.User;
import com.mediquick.web.primary.user.domain.UserDetailsDto;
import com.mediquick.web.primary.user.domain.UserRepository;
import com.mediquick.web.primary.user.domain.UserRequestDto;
import com.mediquick.web.primary.user.domain.UserInfoDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository usersRepository;

    public List<User> findAll() {
        return usersRepository.findAll();
    }

    public User findByUsername(String username) {
        return usersRepository.findByUsername(username);
    }

    public UserDetailsDto findUserDetailsByUsername(String username) {
        return usersRepository.findUserDetailsDtoByUsername(username);
    }

    public UserInfoDto findUserInfoByUsername(String username) {
        return usersRepository.findUserInfoDtoByUsername(username);
    }

    public boolean createUser(User user) {
        if(usersRepository.findByUsername(user.getUsername()) != null)
            return false;

        usersRepository.save(user);
        return true;
    }

    @Transactional
    public boolean updateUser(UserRequestDto userDto) {
        User user = usersRepository.findByUsername(userDto.getUsername());

        if(user == null)
            return false;

        user.update(userDto);
        return true;
    }

    @Transactional
    public boolean deleteUser(String username) {
        User user = usersRepository.findByUsername(username);
        if(user == null)
            return false;

        user.delete();
        return true;
    }

//    public List<UserInfoDto> findAllUsersWithRole() {
//        return usersRepository.findAllUsersWithRole();
//    }

}
