package com.hansung.InsuranceProject.dto;

import com.hansung.InsuranceProject.constant.MessageType;
import com.hansung.InsuranceProject.entity.Message;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long messageId;

    private MessageType messageType;

    private String content;

    public static final MessageDto convertToDto(Message message){
        return MessageDto.builder()
                .messageId(message.getMessageId())
                .messageType(message.getMessageType())
                .content(message.getContent())
                .build();
    }

    public static List<MessageDto> convertToDtoList(List<Message> messages){
        return messages.stream()
                .map(MessageDto::convertToDto)
                .collect(Collectors.toList());
    }
}
