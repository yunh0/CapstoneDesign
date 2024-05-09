package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.repository.MessageRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class MostAskedQuestionService {
    private final MessageRepository messageRepository;

    public MostAskedQuestionService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Transactional
    public List<String> getMostQuestions(){
        List<String> mostQuestions = new ArrayList<>();

        String prediction = messageRepository.findMostFrequentPrediction();
        mostQuestions.add(prediction);

        List<Message> predictionMessages = messageRepository.findTop3ByPredictionAndOrderByRandom(prediction);

        for(Message predictionMessage : predictionMessages){
            mostQuestions.add(predictionMessage.getContent());
        }

        int remainingNulls = 4 - mostQuestions.size();
        for(int i=0; i<remainingNulls; i++){
            mostQuestions.add(null);
        }

        return mostQuestions;
    }
}
