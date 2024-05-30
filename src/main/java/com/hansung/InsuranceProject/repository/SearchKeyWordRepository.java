package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.SearchKeyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SearchKeyWordRepository extends JpaRepository<SearchKeyWord, Long> {

    List<SearchKeyWord> findByAccount_Id(Long accountId);

    SearchKeyWord findByKeyWordId(Long keyWordId);

    @Query("SELECT sk FROM SearchKeyWord sk WHERE sk.account.id = :accountId AND sk.keyWord = :keyWord")
    SearchKeyWord findByAccountIdAndKeyWord(@Param("accountId") Long accountId, @Param("keyWord") String keyWord);
}
