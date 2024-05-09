package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.MostAskedQuestionDto;
import com.hansung.InsuranceProject.service.MostAskedQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MostAskedQuestionController {

    @Autowired
    private MostAskedQuestionService mostAskedQuestionService;

    @PostMapping("/freCo/{chatRoomId}")
    public ResponseEntity mostAskedQuestionRecommendation(@PathVariable Long chatRoomId){
        List<String> mostAskedQuestions = mostAskedQuestionService.getMostQuestions(chatRoomId);
     MostAskedQuestionDto mostAskedQuestionDto = MostAskedQuestionDto.convertToDto(mostAskedQuestions);

        return ResponseEntity.ok().body(mostAskedQuestionDto);
    }
}
