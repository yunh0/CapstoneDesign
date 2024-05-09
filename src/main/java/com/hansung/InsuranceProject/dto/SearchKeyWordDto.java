package com.hansung.InsuranceProject.dto;

import com.hansung.InsuranceProject.entity.SearchKeyWord;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchKeyWordDto {
    private Long keyWordId;

    private String keyWord;

    public static final SearchKeyWordDto convertToDto(SearchKeyWord searchKeyWord){

        return SearchKeyWordDto.builder()
                .keyWordId(searchKeyWord.getKeyWordId())
                .keyWord(searchKeyWord.getKeyWord())
                .build();
    }

    public static List<SearchKeyWordDto> convertToDtoList(List<SearchKeyWord> searchKeyWords){
        return searchKeyWords.stream()
                .map(SearchKeyWordDto::convertToDto)
                .collect(Collectors.toList());
    }
}
