package com.hansung.InsuranceProject.dto;

import lombok.*;

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
}