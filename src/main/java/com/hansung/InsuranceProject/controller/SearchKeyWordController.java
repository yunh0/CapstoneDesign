package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.MessageDto;
import com.hansung.InsuranceProject.dto.SearchKeyWordDto;
import com.hansung.InsuranceProject.entity.SearchKeyWord;
import com.hansung.InsuranceProject.request.SearchMessageRequest;
import com.hansung.InsuranceProject.service.MessageService;
import com.hansung.InsuranceProject.service.SearchKeyWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchKeyWordController {
    @Autowired
    private MessageService messageService;
    @Autowired
    private SearchKeyWordService searchKeyWordService;

    @PostMapping("/user/message/search")
    public ResponseEntity<List<MessageDto>> getSearchMessages(@RequestBody SearchMessageRequest searchMessageRequest, Principal principal){

        SearchKeyWord searchKeyWord = searchKeyWordService.saveKeyWord(Long.valueOf(principal.getName()), searchMessageRequest.getContent());

        List<MessageDto> searchMessages = messageService.getSearchMessages(Long.valueOf(principal.getName()), searchMessageRequest.getContent());
        return ResponseEntity.ok().body(searchMessages);
    }

    @GetMapping("/user/info/search")
    public ResponseEntity<List<SearchKeyWordDto>> giveSearchKeyWords(Principal principal){
        List<SearchKeyWordDto> keyWords = searchKeyWordService.getSearchKeyWords(Long.valueOf(principal.getName()));
        return ResponseEntity.ok().body(keyWords);
    }

    @DeleteMapping("user/info/search/delete/{keyWordId}")
    public ResponseEntity deleteKeyWord(@PathVariable Long keyWordId){
        boolean deleted = searchKeyWordService.deleteSearchKeyword(keyWordId);
        if (deleted) {
            return ResponseEntity.ok().body("success");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail");
        }
    }
}
