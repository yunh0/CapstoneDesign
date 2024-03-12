package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByAccount_Id(Long accountId);
}
