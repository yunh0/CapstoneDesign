package com.hansung.InsuranceProject.entity;

import com.hansung.InsuranceProject.constant.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "message")
public class Message extends BaseTimeEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    private String content;

    @ManyToOne(optional = false)
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;

    public Message(MessageType messageType, String content, ChatRoom chatRoom) {
        this.messageType = messageType;
        this.content = content;
        this.chatRoom = chatRoom;
    }
}
