package com.hansung.InsuranceProject.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "file")
public class FileInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    private String fileName;

    private String filePath;

    public FileInformation(String fileName, String filePath) {
        this.fileName = fileName;
        this.filePath = filePath;
    }
}
