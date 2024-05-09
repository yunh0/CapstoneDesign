package com.hansung.InsuranceProject.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MostAskedQuestionDto {
    private String first;

    private String second;

    private String third;

    private String prediction;

    public static final MostAskedQuestionDto convertToDto(List<String> mostAskedQuestion){
        return MostAskedQuestionDto.builder()
                .first(mostAskedQuestion.get(1))
                .second(mostAskedQuestion.get(2))
                .third(mostAskedQuestion.get(3))
                .prediction(mostAskedQuestion.get(0))
                .build();
    }
}
