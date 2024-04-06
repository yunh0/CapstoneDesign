package com.hansung.InsuranceProject.entity;

import com.hansung.InsuranceProject.constant.MessageType;
import com.hansung.InsuranceProject.entity.BaseTimeEntity;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.PinnedAnswer;
import lombok.*;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "message")
public class Message extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;
    @Enumerated(EnumType.STRING)
    private MessageType messageType;
    private String content;
    @ManyToOne(optional = false)
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;
    @ToString.Exclude
    @OneToMany(mappedBy = "message", fetch = FetchType.EAGER)
    private List<PinnedAnswer> pinnedAnswers = new ArrayList<>();

    private Boolean pinned;

    public Message(MessageType messageType, String content, ChatRoom chatRoom) {
        this.messageType = messageType;
        this.content = content;
        this.chatRoom = chatRoom;
        this.pinned = false;
    }
}