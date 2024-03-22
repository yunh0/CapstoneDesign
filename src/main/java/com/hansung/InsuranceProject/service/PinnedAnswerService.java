package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.dto.PinnedAnswerDto;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.entity.PinnedAnswer;
import com.hansung.InsuranceProject.repository.MessageRepository;
import com.hansung.InsuranceProject.repository.PinnedAnswerRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class PinnedAnswerService {
    private final PinnedAnswerRepository pinnedAnswerRepository;
    private final MessageRepository messageRepository;

    public PinnedAnswerService(PinnedAnswerRepository pinnedAnswerRepository, MessageRepository messageRepository) {
        this.pinnedAnswerRepository = pinnedAnswerRepository;
        this.messageRepository = messageRepository;
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
    public List<PinnedAnswerDto> getPinnedAnswers(){
        return null;
    }
}
