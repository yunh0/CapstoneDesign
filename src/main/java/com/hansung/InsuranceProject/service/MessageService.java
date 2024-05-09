package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.constant.MessageType;
import com.hansung.InsuranceProject.dto.MessageDto;
import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.repository.AccountRepository;
import com.hansung.InsuranceProject.repository.ChatRoomRepository;
import com.hansung.InsuranceProject.repository.MessageRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final AccountRepository accountRepository;

    public MessageService(MessageRepository messageRepository, ChatRoomRepository chatRoomRepository, AccountRepository accountRepository) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.accountRepository = accountRepository;
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

    @Transactional
    public List<MessageDto> getChatRoomMessages(Long chatRoomId){
        List<Message> messages = messageRepository.findByChatRoom_chatRoomId(chatRoomId);
        return MessageDto.convertToDtoList(messages);
    }

    @Transactional
    public List<MessageDto> getSearchMessages(Long accountId, String keyWord){
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account == null) {
            return List.of();
        }

        List<ChatRoom> chatRooms = account.getChatRooms();

        List<Message> allMessages = chatRooms.stream()
                .map(ChatRoom::getMessages)
                .flatMap(List::stream)
                .filter(message -> message.getMessageType() == MessageType.AI)
                .collect(Collectors.toList());

        List<Message> filteredMessages = allMessages.stream()
                .filter(message -> message.getContent().contains(keyWord))
                .collect(Collectors.toList());

        return MessageDto.convertToDtoList(filteredMessages);
    }
}