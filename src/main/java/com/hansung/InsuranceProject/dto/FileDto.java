package com.hansung.InsuranceProject.dto;

import lombok.*;
import com.hansung.InsuranceProject.entity.FileInformation;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {
    private Long fileId;
    private String fileType;
    private String fileCompany;
    private String fileName;
    private String filePath;

    // 기본 생성자, getters, setters 생략
}