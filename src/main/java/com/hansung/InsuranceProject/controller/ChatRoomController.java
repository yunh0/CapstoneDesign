package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.ChatRoomDto;
import com.hansung.InsuranceProject.dto.ChatRoomRequest;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.service.ChatRoomService;
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

    @PostMapping("/insurance/terms")
    public ResponseEntity createChatRoom(@RequestBody ChatRoomRequest request, Principal principal) {

        ChatRoom chatRoom = chatRoomService.createChatRoom(Long.valueOf(principal.getName()), request.getTitle(), request.getInsuranceTerms());
        ChatRoomDto chatRoomDto = ChatRoomDto.convertToDto(chatRoom);

        List<ChatRoomDto> chatRooms = chatRoomService.getUserChatRooms(Long.valueOf(principal.getName()));
        System.out.println("User's Chat Rooms:");
        for (ChatRoomDto chatRoom2 : chatRooms) {
            System.out.println("Chat Room Name: " + chatRoom2.getChatRoomName());
            System.out.println("File Path: " + chatRoom2.getFilePath());
            System.out.println("--------");
        }


        sendFilePathToFlask(chatRoomDto.getFilePath());

        return ResponseEntity.ok().body(chatRoomDto);
    }

    @GetMapping("/user/chatrooms")
    public ResponseEntity<List<ChatRoomDto>> giveUserChatRooms(Principal principal){
        List<ChatRoomDto> chatRooms = chatRoomService.getUserChatRooms(Long.valueOf(principal.getName()));
        return ResponseEntity.ok().body(chatRooms);
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
