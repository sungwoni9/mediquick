package com.mediquick.web.controller;

import com.mediquick.web.primary.finding.domain.Finding;
import com.mediquick.web.primary.finding.domain.FindingRequestDto;
import com.mediquick.web.primary.finding.service.FindingService;
import com.mediquick.web.primary.interpretation.domain.Interpretation;
import com.mediquick.web.primary.interpretation.service.InterpretationService;
import com.mediquick.web.security.JwtUtil;
import com.mediquick.web.util.ResponseDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/report")
@RestController
public class ReportRestController {
    private final FindingService findingService;
    private final InterpretationService interpService;
    private final JwtUtil jwtUtil;

    @PostMapping("/write")
    public ResponseEntity<ResponseDto> write(@RequestBody FindingRequestDto findingDto, HttpSession session) {

        String token = (String) session.getAttribute("jwtToken");
        String username = jwtUtil.extractUsername(token);

        int studykey = 9998;

        Interpretation interpretation = new Interpretation(username, studykey);
        interpService.createInterpretation(interpretation);

        Integer interpretationCode = interpretation.getCode();
        Finding finding = new Finding(interpretationCode, findingDto);
        findingService.createFinding(finding);

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "판독 소견서가 성공적으로 저장되었습니다."));
    }
}