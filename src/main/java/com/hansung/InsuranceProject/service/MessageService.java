package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.constant.MessageType;
import com.hansung.InsuranceProject.dto.MessageDto;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.repository.ChatRoomRepository;
import com.hansung.InsuranceProject.repository.MessageRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;

    public MessageService(MessageRepository messageRepository, ChatRoomRepository chatRoomRepository) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
    }

    @Transactional
    public Message saveMessage(Long chatRoomId, MessageType messageType, String content, String prediction) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (chatRoom != null) {
            Message message = new Message(messageType, content, chatRoom, prediction);
            chatRoom.getMessages().add(message);
            return messageRepository.save(message);
        }
        return null;
    }

    public List<MessageDto> getChatRoomMessages(Long chatRoomId){
        List<Message> messages = messageRepository.findByChatRoom_chatRoomId(chatRoomId);
        return MessageDto.convertToDtoList(messages);
    }
}