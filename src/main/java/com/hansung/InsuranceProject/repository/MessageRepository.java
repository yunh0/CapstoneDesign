package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoom_chatRoomId(Long chatRoomId);

    @Transactional
    default void updateMessageByPinned(Long messageId, boolean pinned){
        findById(messageId).ifPresent(message -> {
            message.setPinned(pinned);
            save(message);
        });
    }
}
