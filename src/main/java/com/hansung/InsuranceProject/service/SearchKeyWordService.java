package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.dto.SearchKeyWordDto;
import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.SearchKeyWord;
import com.hansung.InsuranceProject.repository.AccountRepository;
import com.hansung.InsuranceProject.repository.SearchKeyWordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class SearchKeyWordService {

    private final SearchKeyWordRepository searchKeyWordRepository;
    private final AccountRepository accountRepository;

    public SearchKeyWordService(SearchKeyWordRepository searchKeyWordRepository, AccountRepository accountRepository) {
        this.searchKeyWordRepository = searchKeyWordRepository;
        this.accountRepository = accountRepository;
    }

    public SearchKeyWord saveKeyWord(Long accountId, String keyWord) {
        Account account = accountRepository.findById(accountId).orElse(null);

        if (account != null) {
            SearchKeyWord existingKeyWord = searchKeyWordRepository.findByAccountIdAndKeyWord(accountId, keyWord);
            if (existingKeyWord != null) {
                return null;
            }

            SearchKeyWord searchKeyWord = new SearchKeyWord(keyWord, account);
            account.getSearchKeyWords().add(searchKeyWord);

            return searchKeyWordRepository.save(searchKeyWord);
        }

        return null;
    }

    public List<SearchKeyWordDto> getSearchKeyWords(Long accountId){
        List<SearchKeyWord> keyWords = searchKeyWordRepository.findByAccount_Id(accountId);

        return SearchKeyWordDto.convertToDtoList(keyWords);
    }

    public boolean deleteSearchKeyword(Long keyWordId) {
        SearchKeyWord keyWord = searchKeyWordRepository.findByKeyWordId(keyWordId);
        if (keyWord != null) {
            searchKeyWordRepository.delete(keyWord);
            return true;
        }
        return false;
    }
}
