package com.hansung.InsuranceProject.repository;

import com.hansung.InsuranceProject.entity.Account;
import com.hansung.InsuranceProject.entity.PinnedAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PinnedAnswerRepository extends JpaRepository<PinnedAnswer, Long> {
    List<PinnedAnswer> findByMessage_ChatRoom_Account(Account account);
    Optional<PinnedAnswer> findByMessage_MessageId(Long messageId);

    List<PinnedAnswer> findByMessage_ChatRoom_ChatRoomId(Long chatRoomId);
}
