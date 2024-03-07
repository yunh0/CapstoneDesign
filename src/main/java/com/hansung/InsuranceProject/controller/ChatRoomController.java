package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.CreateRoomRequest;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.repository.ChatRoomRepository;
import com.hansung.InsuranceProject.service.AccountService;
import com.hansung.InsuranceProject.service.ChatRoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private AccountService accountService;
    private static Logger logger = LoggerFactory.getLogger(ChatRoomController.class);
    @PostMapping("/insurance/terms")
    public ResponseEntity<String> createChatRoom(@RequestBody CreateRoomRequest request) {
//        ChatRoom chatRoom = chatRoomService.createChatRoom(1L, request.getRoomName(), request.getFileName());
//        if (chatRoom != null) {
//            return ResponseEntity.ok("Chat room created successfully");
//        } else {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create chat room");
//        }
        logger.info("받은 요청: {}", request);
        return ResponseEntity.ok("Chat room created successfully");
    }
}
