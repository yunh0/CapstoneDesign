package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.service.ChatRoomService;
import com.hansung.InsuranceProject.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @Autowired
    private FileService fileService;

    // 생성자 주입을 통한 FileService 연결 (생성자 코드 생략)

    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllInsuranceTypes() {
        List<String> types = fileService.getAllInsuranceTypes();
        return ResponseEntity.ok(types);
    }
    @GetMapping("/companies")
    public ResponseEntity<List<String>> getInsuranceCompanies(@RequestParam String fileType) {
        List<String> companies = fileService.getInsuranceCompaniesByType(fileType);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/terms")
    public ResponseEntity<List<String>> getInsuranceTerms(@RequestParam String fileType, @RequestParam String fileCompany) {
        List<String> terms = fileService.getInsuranceTermsByTypeAndCompany(fileType, fileCompany);
        return ResponseEntity.ok(terms);
    }

}
