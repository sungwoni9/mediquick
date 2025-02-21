package com.mediquick.web.controller;

import com.mediquick.web.primary.finding.domain.FindingRequestDto;
import com.mediquick.web.primary.finding.service.FindingService;
import com.mediquick.web.util.ResponseDto;
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

    @PostMapping("/write")
    public ResponseEntity<ResponseDto> write(@RequestBody FindingRequestDto findingDto) {
        boolean isSuccess = findingService.createFinding(findingDto);
        if (!isSuccess) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "소견서 작성중 오류가 발생하였습니다."));
        }
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "소견서가 성공적으로 저장되었습니다."));
    }
}
