package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.dto.PinnedAnswerDto;
import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.entity.PinnedAnswer;
import com.hansung.InsuranceProject.repository.AccountRepository;
import com.hansung.InsuranceProject.repository.MessageRepository;
import com.hansung.InsuranceProject.repository.PinnedAnswerRepository;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class PinnedAnswerService {
    private final PinnedAnswerRepository pinnedAnswerRepository;
    private final MessageRepository messageRepository;
    private final AccountRepository accountRepository;
    public PinnedAnswerService(PinnedAnswerRepository pinnedAnswerRepository, MessageRepository messageRepository, AccountRepository accountRepository) {
        this.pinnedAnswerRepository = pinnedAnswerRepository;
        this.messageRepository = messageRepository;
        this.accountRepository = accountRepository;
    }
    @Transactional
    public PinnedAnswer savePinnedAnswer(Long messageId){
        Message message = messageRepository.findById(messageId).orElse(null);
        if(message != null){
            PinnedAnswer pinnedAnswer = new PinnedAnswer(message);
            message.getPinnedAnswers().add(pinnedAnswer);
            return pinnedAnswerRepository.save(pinnedAnswer);
        }
        return null;
    }

    //유저에 대한 핀 답변만 가져오는 로직 구현해야함
    @Transactional
    public boolean deletePinnedAnswer(Long messageId) {
        PinnedAnswer pinnedAnswer = pinnedAnswerRepository.findByMessage_MessageId(messageId).orElse(null);
        try {
            pinnedAnswerRepository.deleteById(pinnedAnswer.getPinnedAnswerId());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<PinnedAnswerDto> getPinnedAnswers(Principal principal){
        Long accountId = Long.valueOf(principal.getName());
        Account account = accountRepository.findById(accountId).orElse(null);
        List<PinnedAnswer> pinnedAnswers = pinnedAnswerRepository.findByMessage_ChatRoom_Account(account);
        return pinnedAnswers.stream()
                .map(pinnedAnswer -> PinnedAnswerDto.convertToDto(
                        pinnedAnswer.getMessage().getChatRoom(),
                        pinnedAnswer.getMessage().getChatRoom().getFileInformation(),
                        pinnedAnswer,
                        pinnedAnswer.getMessage()
                ))
                .collect(Collectors.toList());
    }
}