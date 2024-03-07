package com.hansung.InsuranceProject.dto;

import com.hansung.InsuranceProject.entity.ChatRoom;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {

    private String chatRoomName;

    private static final ChatRoomDto convertToDto(ChatRoom chatRoom){
        return ChatRoomDto.builder()
                .chatRoomName(chatRoom.getChatRoomName())
                .build();
    }
}
