package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.constant.MessageType;
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
public class QuestionRecommendationService {
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;

    public QuestionRecommendationService(MessageRepository messageRepository, ChatRoomRepository chatRoomRepository) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    @Transactional
    public List<String> getRecommendations(Long chatRoomId){
        List<String> recommendations = new ArrayList<>();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        Message message = messageRepository.findFirstByChatRoomAndMessageTypeOrderByCreatedDateDesc(chatRoom, MessageType.PERSON);

        FileInformation fileInformation = chatRoom.getFileInformation();
        String fileType = fileInformation.getFileType();

        if (message == null) {
            for (int i = 0; i < 3; i++) {
                recommendations.add(null);
            }
        } else {
            String prediction = message.getPrediction();

            List<Message> sameFileTypeMessages = messageRepository.findByChatRoomFileInformationFileType(fileType);

            for(Message sameFileTypeMessage : sameFileTypeMessages){
                if(sameFileTypeMessage.getPrediction() != null){
                    if(sameFileTypeMessage.getPrediction().equals(prediction)){
                        recommendations.add(sameFileTypeMessage.getContent());
                    }
                }
            }

            // 현재 저장된 추천 질문이 0개, 1개 또는 2개일 경우, 나머지는 null로 채움
            int remainingNulls = 3 - recommendations.size();
            for (int i = 0; i < remainingNulls; i++) {
                recommendations.add(null);
            }
        }

        return recommendations;
    }
}
