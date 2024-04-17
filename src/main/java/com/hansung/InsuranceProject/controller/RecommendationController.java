package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.RecommendationDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RecommendationController {

    @GetMapping("/freCo")
    public ResponseEntity questionRecommendation(){
        RecommendationDto recommendationDto = RecommendationDto.convertToDto();
        return ResponseEntity.ok().body(recommendationDto);
    }
}