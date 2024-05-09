package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.dto.SearchKeyWordDto;
import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.SearchKeyWord;
import com.hansung.InsuranceProject.repository.AccountRepository;
import com.hansung.InsuranceProject.repository.SearchKeyWordRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class SearchKeyWordService {
    private final SearchKeyWordRepository searchKeyWordRepository;
    private final AccountRepository accountRepository;

    public SearchKeyWordService(SearchKeyWordRepository searchKeyWordRepository, AccountRepository accountRepository) {
        this.searchKeyWordRepository = searchKeyWordRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public SearchKeyWord saveKeyWord(Long accountId, String keyWord){
        Account account = accountRepository.findById(accountId).orElse(null);

        if(account != null){
            SearchKeyWord searchKeyWord = new SearchKeyWord(keyWord, account);
            account.getSearchKeyWords().add(searchKeyWord);
            return searchKeyWordRepository.save(searchKeyWord);
        }

        return null;
    }

    @Transactional
    public List<SearchKeyWordDto> getSearchKeyWords(Long accountId){
        List<SearchKeyWord> keyWords = searchKeyWordRepository.findByAccount_Id(accountId);
        return SearchKeyWordDto.convertToDtoList(keyWords);
    }
}
