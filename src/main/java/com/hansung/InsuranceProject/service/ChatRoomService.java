package com.hansung.InsuranceProject.service;

import com.hansung.InsuranceProject.dto.ChatRoomDto;
import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.FileInformation;
import com.hansung.InsuranceProject.repository.AccountRepository;
import com.hansung.InsuranceProject.repository.ChatRoomRepository;
import com.hansung.InsuranceProject.repository.FileInformationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
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

    public ChatRoom createChatRoom(Long accountId, String chatRoomName, String fileName) {
        Account creator = accountRepository.findById(accountId).orElse(null);
        FileInformation file = fileInformationRepository.findByFileName(fileName).orElse(null);

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

    public String getInsuranceType(Long selectedChatId) {
        Long fileID = chatRoomRepository.findByChatRoomID(selectedChatId);
        String fileType = fileInformationRepository.findByFileId(fileID);

        return fileType;
    }

    public String getInsuranceName(Long selectedChatId) {
        Long fileID = chatRoomRepository.findByChatRoomID(selectedChatId);
        //fileID로 file테이블에서 file type 가져오기
        System.out.println("chatroom service" + fileInformationRepository.findByFileName(fileID));
        return fileInformationRepository.findByFileName(fileID);
    }

    public List<ChatRoomDto> getUserChatRooms(Long accountId){
        List<ChatRoom> chatRooms = chatRoomRepository.findByAccount_Id(accountId);

        return ChatRoomDto.convertToDtoList(chatRooms);
    }

    public void deleteChatRoom(Long chatRoomId){
        chatRoomRepository.deleteById(chatRoomId);
    }

    public void updateChatRoomName(Long chatRoomId, String newChatRoomName) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        chatRoom.setChatRoomName(newChatRoomName);
        chatRoomRepository.save(chatRoom);
    }
}