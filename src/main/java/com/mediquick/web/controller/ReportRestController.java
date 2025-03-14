package com.mediquick.web.controller;

import com.mediquick.web.primary.finding.domain.Finding;
import com.mediquick.web.primary.finding.domain.FindingRequestDto;
import com.mediquick.web.primary.finding.domain.FindingResponseDto;
import com.mediquick.web.primary.finding.service.FindingService;
import com.mediquick.web.primary.interpretation.domain.Interpretation;
import com.mediquick.web.primary.interpretation.service.InterpretationService;
import com.mediquick.web.primary.logs.service.LogService;
import com.mediquick.web.secondary.report.domain.Report;
import com.mediquick.web.secondary.report.domain.ReportRepository;
import com.mediquick.web.secondary.report.domain.ReportResponseDto;
import com.mediquick.web.secondary.study.domain.Study;
import com.mediquick.web.secondary.study.domain.StudyRepository;
import com.mediquick.web.secondary.study.domain.StudyResponseDto;
import com.mediquick.web.util.JwtUtil;
import com.mediquick.web.util.ResponseDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("/report")
@RestController
public class ReportRestController {
    private final FindingService findingService;
    private final InterpretationService interpretationService;
    private final JwtUtil jwtUtil;
    private final StudyRepository studyRepository;
    private final ReportRepository reportRepository;
    private final LogService logService;

    // 판독 소견서 작성
    @PostMapping("/write/{studykey}")
    public ResponseEntity<ResponseDto> write(@PathVariable("studykey")int studykey,@RequestBody FindingRequestDto findingDto, HttpSession session) {

        String token = (String) session.getAttribute("jwtToken");
        String username = jwtUtil.extractUsername(token);

        Interpretation interpretation = interpretationService.findByStudykey(studykey);

        if(interpretation != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT.value()).body(new ResponseDto(HttpStatus.CONFLICT.value(),
                    "이미 생성된 소견서입니다."));
        }

        interpretation = new Interpretation(username, studykey);
        interpretationService.createInterpretation(interpretation);

        Integer interpretationCode = interpretation.getCode();
        Finding finding = new Finding(interpretationCode, findingDto);
        findingService.createFinding(finding);

        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "판독 소견서가 성공적으로 저장되었습니다."));
    }

    // 판독 소견서 수정
    @PutMapping({"", "/"})
    public ResponseEntity<ResponseDto> updateFinding(@RequestBody FindingRequestDto findingDto) {
        boolean isSuccess = findingService.updateFinding(findingDto);
        if(!isSuccess)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST.value())
                    .body(new ResponseDto(HttpStatus.BAD_REQUEST.value(), "소견서를 찾을 수 없습니다."));
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK.value(), "소견서 수정이 완료되었습니다."));
    }

    // 판독 소견 해당 환자 조회
    @GetMapping("/patient/{studykey}")
    public ResponseEntity<ResponseDto> getPatientDataByStudykey(@PathVariable("studykey")int studykey){
        Study study = studyRepository.findStudyByStudykey(studykey);
        if(study == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND.value())
                    .body(new ResponseDto(HttpStatus.NOT_FOUND.value(), "환자 정보를 찾을수 없습니다."));
        return ResponseEntity.ok(
                new StudyResponseDto(
                        study.getStudykey(),
                        study.getPid(),
                        study.getPname(),
                        study.getPsex(),
                        study.getPbirthdatetime()
                ));
    }

    @GetMapping("/tab/{studykey}")
    public ResponseEntity<ResponseDto> getReportByStudykey(@PathVariable("studykey")int studykey){
        Report report = reportRepository.findTopByStudykeyOrderByReadingdateDesc(studykey);
        if(report == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND.value())
                    .body(new ResponseDto(HttpStatus.NOT_FOUND.value(),"소견 기록을 찾을 수 없습니다."));

        return ResponseEntity.ok(new ReportResponseDto(
                report.getStudykey(),
                report.getReadingdrid(),
                report.getReadingdate(),
                report.getStudydesc(),
                report.getModality()
        ));
    }

    // 판독 소견서 조회
    @GetMapping("/{studykey}")
    public ResponseEntity<ResponseDto> getFindingByStudykey(@PathVariable("studykey")int studykey) {
        Integer interpretationCode = interpretationService.findInterpretationCodeByStudykey(studykey);

        if (interpretationCode == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND.value())
                    .body(new ResponseDto(HttpStatus.NOT_FOUND.value(), "해당 studykey에 대한 소견이 존재하지 않습니다."));
        }

        Finding finding = findingService.findFindingByCode(interpretationCode);

        if (finding == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND.value())
                    .body(new ResponseDto(HttpStatus.NOT_FOUND.value(), "존재하지 않는 소견서입니다."));
        }

        FindingResponseDto findingDto = new FindingResponseDto(finding);
        return ResponseEntity.ok(findingDto);
    }
}