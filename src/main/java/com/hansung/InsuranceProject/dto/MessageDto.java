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

    private Boolean pinnedChecked;

    public static final MessageDto convertToDto(Message message){
        Boolean pin;
        if(message.getPinnedAnswers().isEmpty())
            pin = false;
        else
            pin = true;

        return MessageDto.builder()
                .messageId(message.getMessageId())
                .messageType(message.getMessageType())
                .content(message.getContent())
                .pinnedChecked(pin)
                .build();
    }

    public static List<MessageDto> convertToDtoList(List<Message> messages){
        return messages.stream()
                .map(MessageDto::convertToDto)
                .collect(Collectors.toList());
    }
}
