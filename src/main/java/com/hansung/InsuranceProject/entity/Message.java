package com.hansung.InsuranceProject.entity;

import com.hansung.InsuranceProject.constant.MessageType;
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

    private String prediction;

    public Message(MessageType messageType, String content, ChatRoom chatRoom, String prediction) {
        this.messageType = messageType;
        this.content = content;
        this.chatRoom = chatRoom;
        this.pinned = false;
        this.prediction = prediction;
    }
}