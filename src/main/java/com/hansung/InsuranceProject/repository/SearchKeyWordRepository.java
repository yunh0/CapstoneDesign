package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.SearchKeyWord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SearchKeyWordRepository extends JpaRepository<SearchKeyWord, Long> {
    List<SearchKeyWord> findByAccount_Id(Long accountId);
}
