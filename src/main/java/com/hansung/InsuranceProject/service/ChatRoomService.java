package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.dto.ChatRoomDto;
import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.FileInformation;
import com.hansung.InsuranceProject.repository.AccountRepository;
import com.hansung.InsuranceProject.repository.ChatRoomRepository;
import com.hansung.InsuranceProject.repository.FileInformationRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

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

    @Transactional
    public ChatRoom createChatRoom(Long accountId, String chatRoomName, String fileName) {
        Account creator = accountRepository.findById(accountId).orElse(null);
        System.out.println("fileName : " + fileName);
        FileInformation file = fileInformationRepository.findByFileName(fileName).orElse(null);
        if (creator != null) {
            ChatRoom chatRoom = new ChatRoom(chatRoomName, creator, file);
            System.out.println("chat room name: " + chatRoomName + ", " + "creator: " + creator + "file :" + file);
            creator.getChatRooms().add(chatRoom);
            return chatRoomRepository.save(chatRoom);
        }

        return null;
    }

    public ChatRoom getChatRoom(Long id){
        return chatRoomRepository.findById(id).orElse(null);
    }

    public List<ChatRoomDto> getUserChatRooms(Long accountId){
        List<ChatRoom> chatRooms = chatRoomRepository.findByAccount_Id(accountId);
        return ChatRoomDto.convertToDtoList(chatRooms);
    }
}
