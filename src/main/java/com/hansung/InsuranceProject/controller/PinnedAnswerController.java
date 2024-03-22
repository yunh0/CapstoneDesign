package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.PinnedAnswerDto;
import com.hansung.InsuranceProject.entity.PinnedAnswer;
import com.hansung.InsuranceProject.service.PinnedAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PinnedAnswerController {

    @Autowired
    private PinnedAnswerService pinnedAnswerService;

    @PostMapping("/savePin/{messageId}")
    public ResponseEntity savePinnedAnswer(@PathVariable Long messageId){
        PinnedAnswer pinnedAnswer = pinnedAnswerService.savePinnedAnswer(messageId);

        if (pinnedAnswer != null) {
            return ResponseEntity.ok().body("Pinned answer saved successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save pinned answer.");
        }
    }
    
    // 핀 답변 받아와서 넘겨주는 로직 추가해야 함
    @GetMapping("/getPin")
    public ResponseEntity<List<PinnedAnswerDto>> getPinnedAnswer(Principal principal){
        return null;
    }
}
