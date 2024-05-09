package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.constant.MessageType;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoom_chatRoomId(Long chatRoomId);
    Message findFirstByChatRoomAndMessageTypeOrderByCreatedDateDesc(ChatRoom chatRoom, MessageType messageType);


    @Transactional
    default void updateMessageByPinned(Long messageId, boolean pinned){
        findById(messageId).ifPresent(message -> {
            message.setPinned(pinned);
            save(message);
        });
    }

    @Query(value = "SELECT m FROM Message m WHERE m.prediction = ?1 ORDER BY RAND()")
    List<Message> findTop3ByPredictionAndOrderByRandom(String prediction);
}