package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.ChatRoomDto;
import com.hansung.InsuranceProject.dto.MessageDto;
import com.hansung.InsuranceProject.dto.PinnedAnswerDto;
import com.hansung.InsuranceProject.request.ChatRoomRequest;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.service.ChatRoomService;
import com.hansung.InsuranceProject.service.MessageService;
import com.hansung.InsuranceProject.service.PinnedAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private PinnedAnswerService pinnedAnswerService;

    // 채팅방 새로 생성 시 반영하여 내 채팅방 목록 반환
    @PostMapping("/insurance/terms")
    public ResponseEntity createChatRoom(@RequestBody ChatRoomRequest request, Principal principal) {

        ChatRoom chatRoom = chatRoomService.createChatRoom(Long.valueOf(principal.getName()), request.getTitle(), request.getInsuranceTerms());
        ChatRoomDto chatRoomDto = ChatRoomDto.convertToDto(chatRoom);

        List<ChatRoomDto> chatRooms = chatRoomService.getUserChatRooms(Long.valueOf(principal.getName()));

        //아래 5줄은 테스트 코드임. 완성되면 지울 것
        System.out.println("User's Chat Rooms:");
        for (ChatRoomDto chatRoom2 : chatRooms) {
            System.out.println("Chat Room id : " + chatRoom2.getChatRoomId());
            System.out.println("Chat Room Name: " + chatRoom2.getChatRoomName());
            System.out.println("File Path: " + chatRoom2.getFilePath());
            System.out.println("--------");
        }

        return ResponseEntity.ok().body(chatRooms);
    }

    // 내 채팅방 목록 반환
    @GetMapping("/user/chatrooms")
    public ResponseEntity<List<ChatRoomDto>> giveUserChatRooms(Principal principal){
        List<ChatRoomDto> chatRooms = chatRoomService.getUserChatRooms(Long.valueOf(principal.getName()));
        return ResponseEntity.ok().body(chatRooms);
    }

    // 채팅방 하나 선택 시 통신
    @GetMapping("/user/chatroom/{chatroomId}")
    public ResponseEntity<List<MessageDto>> getChatRoomInformation(@PathVariable Long chatroomId, Principal principal){
        ChatRoom chatRoom = chatRoomService.getChatRoom(chatroomId);
        ChatRoomDto chatRoomDto = ChatRoomDto.convertToDto(chatRoom);

        sendFilePathToFlask(chatRoomDto.getFilePath());

        List<MessageDto> messages = messageService.getChatRoomMessages(chatroomId);
        return ResponseEntity.ok().body(messages);
    }

    @DeleteMapping("/user/chatroom/{chatroomId}")
    public ResponseEntity<String> deleteChatRoom(@PathVariable Long chatroomId) {

        pinnedAnswerService.deletePinnedAnswersByChatRoomId(chatroomId);

        messageService.deleteMessagesByChatRoomId(chatroomId);

        chatRoomService.deleteChatRoom(chatroomId);

        return ResponseEntity.ok().body("{\"message\": \"Chat room and related messages and pinned messages deleted successfully.\"}");
    }

    @PutMapping("/user/chatroom/{chatroomId}")
    public ResponseEntity<String> updateChatRoomName(@PathVariable Long chatroomId, @RequestBody Map<String, String> requestBody) {

        String newChatRoomName = requestBody.get("newChatRoomName");
        if (newChatRoomName == null || newChatRoomName.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"New chat room name is required.\"}");

        }

        chatRoomService.updateChatRoomName(chatroomId, newChatRoomName);

        return ResponseEntity.ok().body("{\"message\": \"Chat room name updated successfully.\"}");

    }


    @GetMapping("/user/chatroom/file/{selectedChatId}")
    public ResponseEntity<String> giveFileType(@PathVariable Long selectedChatId, Principal principal){
        String fetchedType = chatRoomService.getInsuranceType(selectedChatId);
        return ResponseEntity.ok().body(fetchedType);
    }

    @GetMapping("/user/chatroom/file/name/{selectedChatId}")
    public ResponseEntity<String> getFileName(@PathVariable Long selectedChatId, Principal principal){
        String fetchedName = chatRoomService.getInsuranceName(selectedChatId);
        System.out.println("fetchedName: " + fetchedName);
        return ResponseEntity.ok().body(fetchedName);
    }


    private void sendFilePathToFlask(String filePath) {
        // Flask 서버 URL
        String flaskServerUrl = "http://localhost:5000/api/receive";

        // HTTP 요청 헤더
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 데이터 준비
        Map<String, String> data = new HashMap<>();
        data.put("filePath", filePath);

        // HTTP 요청 엔터티
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(data, headers);

        // HTTP POST 요청 만들기
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(flaskServerUrl, requestEntity, String.class);

        // 필요한 경우 응답 처리
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            System.out.println("데이터를 Flask 서버로 성공적으로 전송했습니다");
        } else {
            System.err.println("Flask 서버로 데이터를 보내는 데 실패했습니다. 응답 코드: " + responseEntity.getStatusCodeValue());
        }
    }
}