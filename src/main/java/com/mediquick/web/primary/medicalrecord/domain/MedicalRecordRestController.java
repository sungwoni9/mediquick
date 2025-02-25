package com.mediquick.web.primary.medicalrecord.domain;


import com.mediquick.web.primary.medicalrecord.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/medical-records")
public class MedicalRecordRestController {
    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<MedicalRecord> createRecord(@RequestBody MedicalRecord medicalRecord) {
        MedicalRecord savedRecord = medicalRecordService.save(medicalRecord);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedRecord);
    }

    @GetMapping
    public ResponseEntity<Object> getRecordsByPid(@RequestParam String pid){
        List<MedicalRecord> records = medicalRecordService.findByPid(pid);
        if(records.isEmpty()){
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
        if(existingRecord == null){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        updatedRecord.setCode(code);
        MedicalRecord saveRecord = medicalRecordService.save(updatedRecord);
        return ResponseEntity.ok(saveRecord);
    }

}
