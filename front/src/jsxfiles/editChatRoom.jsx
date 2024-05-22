//채팅방 이름 수정 및 삭제

import React, { useState } from 'react';
import { delChatRoom } from "../api/delChatRoom";
import {editChatRoom} from "../api/editChatRoom";

//isOpen, onClose, actionId, actionTitle이라는 props를 받는 EditChatModal이라는 함수형 컴포넌트를 정의
const EditChatModal = ({ isOpen, onClose, actionId, actionTitle }) => {
    //editingMode와 name 상태 변수를 선언. editingMode는 현재 편집 모드를, name은 입력된 이름을 저장
    const [editingMode, setEditingMode] = useState(null);
    const [name, setName] = useState("");

//삭제 버튼 클릭 시 editingMode를 'delete'로 설정
    const handleDeleteClick = () => {
        setEditingMode('delete');
    };
//이름 수정 버튼 클릭 시 editingMode를 'editName'으로 설정
    const handleEditNameClick = () => {
        setEditingMode('editName');
    };
//삭제 확인 버튼 클릭 시 호출되는 함수
    const handleConfirmClick = async () => {
        if (editingMode === 'delete') {
            //delChatRoom API를 호출
            const results = await delChatRoom(actionId);
            //모달 닫기
            onClose();
            //페이지 새로고침
            window.location.reload()
        }
        //editingMode를 초기화
        setEditingMode(null);
    };

    //이름 수정 확인 버튼 클릭 시 호출되는 함수
    const handleEditClick = async () => {
        if (editingMode === 'editName') {
            if(name === '') return;
            //editChatRoom API를 호출
            const results = await editChatRoom(actionId, name);
            //name 상태변수 초기화
            setName('');
            //모달 닫기
            onClose();
            //페이지 새로고침
            window.location.reload();
        }
        //editingMode를 초기화
        setEditingMode(null);
    };

//모달 닫기 버튼 클릭 시 호출되는 함수
    const handleClose = () => {
        //editingMode를 초기화
        setEditingMode(null);
        //name 상태변수 초기화
        setName('');
        //모달 닫기
        onClose();
    };

    return (
        //그룹화
        <>
            //isOpen이 true일 때 모달 렌더링
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        {/*handleClose 함수를 호출하는 닫기 버튼*/}
                        <button onClick={handleClose}>&times;</button>
                        {/*제목은 actionTitle과 현재 editingMode에 따라 다르게 표시*/}
                        <h2>{actionTitle} {editingMode === 'delete' ? '삭제하기' : editingMode === 'editName' ? '제목 수정' : 'Edit Page'}</h2>
                        <div>
                            {/*editingMode에 따라 다른 내용을 렌더링*/}
                            {editingMode ? (
                                <>
                                    {/*editingMode가 delete일 때: 삭제 확인 메시지와 "예" 및 "아니오" 버튼을 표시*/}
                                    {editingMode === 'delete' ? (
                                        <>
                                            <p>정말로 삭제하시겠습니까?</p>
                                            <button onClick={handleConfirmClick}>예</button>
                                            <button onClick={handleClose}>아니오</button>
                                        </>
                                    ) : (
                                        //editingMode가 editName일 때: 이름 입력 필드와 "수정하기" 및 "취소" 버튼을 표시
                                        <>
                                            <input
                                                type="text"
                                                placeholder="내용을 입력하세요"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button onClick={handleEditClick}>수정하기</button>
                                            <button onClick={handleClose}>취소</button>
                                        </>
                                    )}
                                </>
                            ) : (
                                //editingMode가 없을 때: "삭제하기" 및 "이름 수정" 버튼을 표시
                                <>
                                    <button onClick={handleDeleteClick}>삭제하기</button>
                                    <button onClick={handleEditNameClick}>이름 수정</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditChatModal;
