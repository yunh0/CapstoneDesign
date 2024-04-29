package com.hansung.InsuranceProject.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRecommendationDto {
    private String first;

    private String second;

    private String third;

    public static final QuestionRecommendationDto convertToDto(){
        return QuestionRecommendationDto.builder()
                .first("첫번째 테스트 추천입니다.")
                .second("두번째 테스트 추천입니다.")
                .third("세번째 테스트 추천입니다.")
                .build();
    }
}
