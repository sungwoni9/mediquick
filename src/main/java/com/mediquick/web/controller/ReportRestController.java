package com.mediquick.web.controller;

import com.mediquick.web.primary.finding.domain.Finding;
import com.mediquick.web.primary.finding.domain.FindingRequestDto;
import com.mediquick.web.primary.finding.service.FindingService;
import com.mediquick.web.primary.interpretation.domain.Interpretation;
import com.mediquick.web.primary.interpretation.service.InterpretationService;
import com.mediquick.web.security.JwtUtil;
import com.mediquick.web.util.ResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/report")
@RestController
public class ReportRestController {
    private final FindingService findingService;
    private final InterpretationService interpService;
    private final JwtUtil jwtUtil;

    @PostMapping("/write")
    public ResponseEntity<ResponseDto> write(@RequestBody FindingRequestDto findingDto, HttpServletRequest request) {
        Finding finding = new Finding(findingDto);
        Finding entity = findingService.createFinding(finding);

        Cookie[] cookies = request.getCookies();
        String token = "";
        for(Cookie cookie : cookies) {
            String cookieName = cookie.getName();
            if(cookieName.equals("jwtToken")) {
                token = cookie.getValue();
            }
        }

        // 판독 객체 생성 및 데이터베이스 저장
        String username = jwtUtil.extractUsername(token);
//      Integer studykey = findingDto.getStudykey();
        Integer studykey = 9999;
        Integer findingCode = entity.getCode();

        Interpretation interpretation = new Interpretation(username, studykey, findingCode);
        interpService.createInterpretation(interpretation);

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "판독 소견서가 성공적으로 저장되었습니다."));
    }
}