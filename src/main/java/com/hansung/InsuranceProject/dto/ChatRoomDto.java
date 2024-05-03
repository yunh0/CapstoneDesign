package com.hansung.InsuranceProject.dto;

import com.hansung.InsuranceProject.entity.ChatRoom;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    private Long chatRoomId;

    private String chatRoomName;

    private String filePath;
    private static Long fileId;

    public static final ChatRoomDto convertToDto(ChatRoom chatRoom){
        return ChatRoomDto.builder()
                .chatRoomId(chatRoom.getChatRoomId())
                .chatRoomName(chatRoom.getChatRoomName())
                .filePath(chatRoom.getFileInformation().getFilePath())
                .build();
    }

    public static List<ChatRoomDto> convertToDtoList(List<ChatRoom> chatRooms) {
        return chatRooms.stream()
                .map(ChatRoomDto::convertToDto)
                .collect(Collectors.toList());
    }

}
