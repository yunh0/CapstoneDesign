package com.hansung.InsuranceProject.entity;

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
@Table(name = "pinnedAnswer")
public class PinnedAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pinnedAnswerId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "messageId")
    private Message message;

    @Column(name = "fetched_type")
    private String fetchedType;

    @Column(name = "chatRoomId")
    private Long chatRoomId;

    public PinnedAnswer(Message message, String fetchedType, Long chatRoomId){
        this.message = message;
        this.fetchedType = fetchedType;
        this.chatRoomId = chatRoomId;
    }
}