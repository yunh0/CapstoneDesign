package com.hansung.InsuranceProject.dto;

import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.FileInformation;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.entity.PinnedAnswer;
import lombok.*;

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

    private String fetchedType;

    public static final PinnedAnswerDto convertToDto(ChatRoom chatRoom, FileInformation fileInformation, PinnedAnswer pinnedAnswer, Message message){
        return PinnedAnswerDto.builder()
                .chatRoomId(chatRoom.getChatRoomId())
                .chatRoomName(chatRoom.getChatRoomName())
                .fileName(fileInformation.getFileName())
                .pinnedAnswerId(pinnedAnswer.getPinnedAnswerId())
                .content(message.getContent())
                .fetchedType(pinnedAnswer.getFetchedType())
                .build();
    }
}