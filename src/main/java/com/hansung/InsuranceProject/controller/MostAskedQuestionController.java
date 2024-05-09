package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.MostAskedQuestionDto;
import com.hansung.InsuranceProject.service.MostAskedQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MostAskedQuestionController {

    @Autowired
    private MostAskedQuestionService mostAskedQuestionService;

    @GetMapping("/freCo")
    public ResponseEntity mostAskedQuestionRecommendation(){
        List<String> mostAskedQuestions = mostAskedQuestionService.getMostQuestions();
        MostAskedQuestionDto mostAskedQuestionDto = MostAskedQuestionDto.convertToDto(mostAskedQuestions);

        return ResponseEntity.ok().body(mostAskedQuestionDto);
    }
}
