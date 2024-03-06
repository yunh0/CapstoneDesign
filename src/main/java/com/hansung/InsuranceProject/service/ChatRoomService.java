package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.FileInformation;
import com.hansung.InsuranceProject.repository.AccountRepository;
import com.hansung.InsuranceProject.repository.ChatRoomRepository;
import com.hansung.InsuranceProject.repository.FileInformationRepository;
import org.springframework.stereotype.Service;

@Service
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final AccountRepository accountRepository;
    private final FileInformationRepository fileInformationRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository, AccountRepository accountRepository, FileInformationRepository fileInformationRepository){
        this.chatRoomRepository = chatRoomRepository;
        this.accountRepository = accountRepository;
        this.fileInformationRepository = fileInformationRepository;
    }

    public ChatRoom createChatRoom(Long accountId, String chatRoomName, Long fileId) {
        Account creator = accountRepository.findById(accountId).orElse(null);
        FileInformation file = fileInformationRepository.findById(fileId).orElse(null);
        if (creator != null) {
            ChatRoom chatRoom = new ChatRoom(chatRoomName, creator, file);
            creator.getChatRooms().add(chatRoom);
            return chatRoomRepository.save(chatRoom);
        }

        return null;
    }

    public ChatRoom getChatRoom(Long id){
        return chatRoomRepository.findById(id).orElse(null);
    }
}