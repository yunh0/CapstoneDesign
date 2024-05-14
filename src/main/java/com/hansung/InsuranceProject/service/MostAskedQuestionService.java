package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.FileInformation;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.repository.ChatRoomRepository;
import com.hansung.InsuranceProject.repository.MessageRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class MostAskedQuestionService {
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;

    public MostAskedQuestionService(MessageRepository messageRepository, ChatRoomRepository chatRoomRepository) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    @Transactional
    public List<String> getMostQuestions(Long chatRoomId){
        List<String> mostQuestions = new ArrayList<>();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        FileInformation fileInformation = chatRoom.getFileInformation();
        String fileType = fileInformation.getFileType();

        List<String> prediction = messageRepository.findMostFrequentPredictionByFileType(fileType);
        System.out.println("=========");
        System.out.println(prediction);
        System.out.println("=========");
        if(prediction.isEmpty() || prediction.get(0) == null) {
            mostQuestions.add(null);
        }
        else{
            mostQuestions.add(prediction.get(0));
            List<Message> predictionMessages = messageRepository.findByChatRoomFileInformationFileTypeAndPredictionOrderByRandom(fileType, prediction.get(0));
            for(Message predictionMessage : predictionMessages){
                mostQuestions.add(predictionMessage.getContent());
            }
        }

        int remainingNulls = 4 - mostQuestions.size();
        for(int i=0; i<remainingNulls; i++){
            mostQuestions.add(null);
        }

        for(int i=0; i<mostQuestions.size(); i++){
            System.out.println("===========");
            System.out.println(mostQuestions.get(i));
            System.out.println("===========");
        }
        return mostQuestions;
    }
}