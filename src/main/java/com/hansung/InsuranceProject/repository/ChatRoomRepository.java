package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    List<ChatRoom> findByAccount_Id(Long accountId);

    @Query("SELECT c.fileInformation.fileId FROM ChatRoom c WHERE c.chatRoomId = ?1")
    Long findByChatRoomID(Long chatRoomId);
}
