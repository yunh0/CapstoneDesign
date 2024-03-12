package com.hansung.InsuranceProject.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(optional = false)
    @JoinColumn(name = "id")
    private Account account;

    @ManyToOne(optional = false)
    @JoinColumn(name = "file_id")
    private FileInformation fileInformation;

    @ToString.Exclude
    @OneToMany(mappedBy = "chatRoom")
    private List<Message> messages = new ArrayList<>();

    public ChatRoom(String chatRoomName, Account account, FileInformation fileInformation) {
        this.chatRoomName = chatRoomName;
        this.account = account;
        this.fileInformation = fileInformation;
    }
}
