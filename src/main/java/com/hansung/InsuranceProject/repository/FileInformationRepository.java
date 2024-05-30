package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.FileInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FileInformationRepository extends JpaRepository<FileInformation, Long> {

    Optional<FileInformation> findByFileName(String fileName);

    @Query("SELECT DISTINCT f.fileType FROM FileInformation f")
    List<String> findAllDistinctFileTypes();

    @Query("SELECT DISTINCT f.fileCompany FROM FileInformation f WHERE f.fileType = ?1")
    List<String> findDistinctCompaniesByType(String fileType);

    @Query("SELECT f.fileName FROM FileInformation f WHERE f.fileType = ?1 AND f.fileCompany = ?2")
    List<String> findFileNamesByTypeAndCompany(String fileType, String fileCompany);

    @Query("SELECT f.filePath FROM FileInformation f WHERE f.fileName = ?1")
    List<String> findFilePathByFileName(String fileName);

    @Query("SELECT f.fileType FROM FileInformation f WHERE f.fileId = ?1")
    String findByFileId(Long fileId);

    @Query("SELECT f.fileName FROM FileInformation f WHERE f.fileId = ?1")
    String findByFileName(Long fileId);
}
