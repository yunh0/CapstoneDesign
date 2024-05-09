package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.constant.MessageType;
import com.hansung.InsuranceProject.entity.ChatRoom;
import com.hansung.InsuranceProject.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("SELECT m FROM Message m WHERE m.chatRoom.chatRoomId = :chatRoomId AND m.messageId > :messageId ORDER BY m.messageId ASC")
    List<Message> findNextMessage(@Param("chatRoomId") Long chatRoomId, @Param("messageId") Long messageId);

    @Query(value = "SELECT m FROM Message m WHERE m.prediction = ?1 ORDER BY RAND()")
    List<Message> findTop3ByPredictionAndOrderByRandom(String prediction);

    @Query(value = "SELECT m.prediction FROM Message m WHERE m.chatRoom.fileInformation.fileType = :fileType " +
            "GROUP BY m.prediction ORDER BY COUNT(m.prediction) DESC")
    List<String> findMostFrequentPredictionByFileType(@Param("fileType") String fileType);

    @Query(value = "SELECT m FROM Message m WHERE m.chatRoom.fileInformation.fileType = :fileType ORDER BY RAND()")
    List<Message> findByChatRoomFileInformationFileTypeOrderByRandom(@Param("fileType") String fileType);

    @Query(value = "SELECT m FROM Message m WHERE m.chatRoom.fileInformation.fileType = :fileType AND m.prediction = :prediction ORDER BY RAND()")
    List<Message> findByChatRoomFileInformationFileTypeAndPredictionOrderByRandom(@Param("fileType") String fileType, @Param("prediction") String prediction);
}