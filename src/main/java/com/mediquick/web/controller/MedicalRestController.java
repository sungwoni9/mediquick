package com.mediquick.web.controller;


import com.mediquick.web.primary.medicalrecord.domain.MedicalRecord;
import com.mediquick.web.primary.medicalrecord.service.MedicalRecordService;
import com.mediquick.web.security.JwtUtil;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/medical")
public class MedicalRestController {
    private final MedicalRecordService medicalRecordService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<MedicalRecord> createRecord(@RequestBody MedicalRecord medicalRecord, HttpSession session) {
        String token = (String) session.getAttribute("jwtToken");
        if (token == null) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        String username = jwtUtil.extractUsername(token);
        System.out.println("Username from JWT: " + username);

        // MedicalRecord에 username 설정
        medicalRecord.setUsername(username);

        if (medicalRecord.getStudykey() == null) { // studykey가 null인지 확인
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }

        try {
        // MedicalRecord 저장
        MedicalRecord savedRecord = medicalRecordService.save(medicalRecord);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedRecord);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping
    public ResponseEntity<Object> getRecordsByPid(@RequestParam String pid) {
        List<MedicalRecord> records = medicalRecordService.findByPid(pid);
        if (records.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("해당 환자의 진료 기록이 없습니다.");
        }
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Object> getRecordByCode(@PathVariable Integer code) {
        MedicalRecord medicalRecord = medicalRecordService.findByCode(code);
        if (medicalRecord == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("해당 진료 기록을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(medicalRecord);
    }

    @PutMapping("/{code}")
    public ResponseEntity<MedicalRecord> updateRecord(@PathVariable Integer code, @RequestBody MedicalRecord updatedRecord) {
        MedicalRecord existingRecord = medicalRecordService.findByCode(code);
        if (existingRecord == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        updatedRecord.setCode(code);
        MedicalRecord saveRecord = medicalRecordService.save(updatedRecord);
        return ResponseEntity.ok(saveRecord);
    }
}
