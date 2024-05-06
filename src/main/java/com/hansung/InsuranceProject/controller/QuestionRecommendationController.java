package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.QuestionRecommendationDto;
import com.hansung.InsuranceProject.service.QuestionRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(("/api"))
public class QuestionRecommendationController {

    @Autowired
    QuestionRecommendationService questionRecommendationService;

    @PostMapping("/sreCo/{chatRoomId}")
    public ResponseEntity userQuestionRecommendation(@PathVariable Long chatRoomId){

        List<String> questionRecommendation = questionRecommendationService.getRecommendations(chatRoomId);
        QuestionRecommendationDto questionRecommendationDto = QuestionRecommendationDto.convertToDto(questionRecommendation);

        return ResponseEntity.ok().body(questionRecommendationDto);
    }
}