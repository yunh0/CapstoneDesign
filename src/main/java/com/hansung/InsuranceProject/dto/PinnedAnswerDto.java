package com.hansung.InsuranceProject.dto;

import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.FileInformation;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.entity.PinnedAnswer;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PinnedAnswerDto {
    private Long chatRoomId;

    private String chatRoomName;

    private String fileName;

    private Long pinnedAnswerId;

    private String content;

    public static final PinnedAnswerDto convertToDto(ChatRoom chatRoom, FileInformation fileInformation, PinnedAnswer pinnedAnswer, Message message){
        return PinnedAnswerDto.builder()
                .chatRoomId(chatRoom.getChatRoomId())
                .chatRoomName(chatRoom.getChatRoomName())
                .fileName(fileInformation.getFileName())
                .pinnedAnswerId(pinnedAnswer.getPinnedAnswerId())
                .content(message.getContent())
                .build();
    }
}
