package com.hansung.InsuranceProject.controller;

import com.hansung.InsuranceProject.dto.ChatRoomRequest;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import static com.hansung.InsuranceProject.dto.ChatRoomDto.convertToDto;

@RestController
@RequestMapping("/api")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    @PostMapping("/insurance/terms")
    public ResponseEntity createChatRoom(@RequestBody ChatRoomRequest request, Principal principal) {

        ChatRoom chatRoom = chatRoomService.createChatRoom(Long.valueOf(principal.getName()), request.getTitle(), request.getInsuranceTerms());
        return ResponseEntity.ok().body(convertToDto(chatRoom));
    }
}
