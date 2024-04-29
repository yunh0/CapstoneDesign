package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.QuestionRecommendationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(("/api"))
public class QuestionRecommendationController {

    @GetMapping("/sreCo")
    public ResponseEntity userQuestionRecommendation(){
        QuestionRecommendationDto questionRecommendationDto = QuestionRecommendationDto.convertToDto();
        return ResponseEntity.ok().body(questionRecommendationDto);
    }
}
