package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.service.AccountService;
import com.hansung.InsuranceProject.user.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

import static com.hansung.InsuranceProject.dto.AccountDto.convertToDto;

@RestController
@RequestMapping("/api/oauth")
public class AccountController {

    @Autowired
    AccountService accountService;

    @GetMapping("/user/info")
    public ResponseEntity getUserInfo(Principal principal) {
        Account account = accountService.getAccount(Long.valueOf(principal.getName()));
        return ResponseEntity.ok().body(convertToDto(account));
    }
}
