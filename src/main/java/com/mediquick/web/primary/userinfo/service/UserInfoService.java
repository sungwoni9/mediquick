package com.mediquick.web.primary.userinfo.service;

import com.mediquick.web.primary.userinfo.domain.UserInfo;
import com.mediquick.web.primary.userinfo.domain.UserInfoRepository;
import com.mediquick.web.primary.userinfo.domain.UserInfoRequestDto;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserInfoService {
    private final UserInfoRepository userInfoRepository;

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

    // 가입된 사용자 정보 가져오기
    @Transactional(readOnly = true)
    public List<UserInfo> findAll(){
        return userInfoRepository.findAll();
    }
}
