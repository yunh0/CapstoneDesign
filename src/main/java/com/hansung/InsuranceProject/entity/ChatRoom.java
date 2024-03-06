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
@Table(name = "chatRoom")
public class ChatRoom extends BaseTimeEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;

    private String chatRoomName;

    @ManyToOne
    @JoinColumn(name= "account_id")
    private Account account;

    public ChatRoom(String chatRoomName) {
        this.chatRoomName = chatRoomName;
    }
}
