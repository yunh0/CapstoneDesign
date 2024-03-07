package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.FileInformation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileInformationRepository extends JpaRepository<FileInformation, Long> {
}
