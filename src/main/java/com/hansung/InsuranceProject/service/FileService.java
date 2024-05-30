package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.repository.FileInformationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class FileService {

    private final FileInformationRepository fileInformationRepository;

    public FileService(FileInformationRepository fileInformationRepository) {
        this.fileInformationRepository = fileInformationRepository;
    }

    public List<String> getAllInsuranceTypes() {
        return fileInformationRepository.findAllDistinctFileTypes();
    }

    public List<String> getInsuranceCompaniesByType(String fileType) {
        return fileInformationRepository.findDistinctCompaniesByType(fileType);
    }

    public List<String> getInsuranceTermsByTypeAndCompany(String fileType, String fileCompany) {
        return fileInformationRepository.findFileNamesByTypeAndCompany(fileType, fileCompany);
    }

}
