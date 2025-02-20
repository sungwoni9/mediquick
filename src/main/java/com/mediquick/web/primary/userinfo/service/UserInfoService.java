package com.mediquick.web.primary.userinfo.service;

import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userinfo.domain.UserInfoRepository;
import com.mediquick.web.primary.userinfo.domain.UserInfoRequestDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserInfoService {
    private final UserInfoRepository userInfoRepository;

    public UserInfo findByUserName(String userName) {
        return userInfoRepository.findByUsername(userName);
    }

    public UserInfo findByPhone(String phone) {
        return userInfoRepository.findByPhone(phone);
    }

    public UserInfo findByEmail(String email) {
        return userInfoRepository.findByEmail(email);
    }

    public Boolean createUserInfo(UserInfo userInfo) {
        if(userInfoRepository.findByUsername(userInfo.getUsername()) != null)
            return false;

        userInfoRepository.save(userInfo);
        return true;
    }

    @Transactional
    public Boolean updateUserInfo(UserInfoRequestDto userInfoDto) {
        UserInfo userInfo = userInfoRepository.findByUsername(userInfoDto.getUsername());

        if (userInfo == null)
            return false;

        userInfo.update(userInfoDto);
        return true;
    }

    @Transactional
    public Boolean deleteUserInfo(String username) {
        UserInfo userInfo = userInfoRepository.findByUsername(username);

        if (userInfo == null)
            return false;

        userInfo.delete();
        return true;
    }
}
