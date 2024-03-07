package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.FileInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileInformationRepository extends JpaRepository<FileInformation, Long> {
    Optional<FileInformation> findByFileName(String fileName);
}
