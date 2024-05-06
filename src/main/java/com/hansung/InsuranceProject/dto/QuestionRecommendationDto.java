package com.hansung.InsuranceProject.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRecommendationDto {
    private String first;

    private String second;

    private String third;

    public static final QuestionRecommendationDto convertToDto(List<String> questionRecommendation){
        return QuestionRecommendationDto.builder()
                .first(questionRecommendation.get(0))
                .second(questionRecommendation.get(1))
                .third(questionRecommendation.get(2))
                .build();
    }
}