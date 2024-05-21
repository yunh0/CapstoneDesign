import React, { useState } from 'react';
import { delChatRoom } from "../api/delChatRoom";
import {editChatRoom} from "../api/editChatRoom";
import {getUserChatRooms} from "../api/getChatRoom";
import '../cssfiles/editChatRoom.css';


const EditChatModal = ({ isOpen, onClose, actionId, actionTitle }) => {
    const [editingMode, setEditingMode] = useState(null);
    const [name, setName] = useState("");
    const [chatList, setChatList] = useState([]);

    const updateChatList = async () => {
        try {
            const token = localStorage.getItem('token');
            const chatRooms = await getUserChatRooms(token);
            if (chatRooms && chatRooms.length > 0) {
                // Map the fetched chat rooms to the structure expected by your state
                const updatedChatList = chatRooms.map(chatRoom => ({
                    id: chatRoom.chatRoomId,
                    title: chatRoom.chatRoomName,
                    pdfUrl: chatRoom.filePath,
                }));
                setChatList(updatedChatList);
            } else {
                // If no chat rooms are fetched, you might want to clear the current state
                // or handle this case differently based on your application's needs.
                setChatList([]);
            }
        } catch (error) {
            console.error('채팅방 목록을 불러오는 중 오류가 발생했습니다:', error.message);
        }
    };

    const handleDeleteClick = () => {
        setEditingMode('delete');
    };

    const handleEditNameClick = () => {
        setEditingMode('editName');
    };

    const handleConfirmClick = async () => {
        if (editingMode === 'delete') {
            const results = await delChatRoom(actionId);
            console.log(results);
            onClose();
            window.location.reload()
        }
        setEditingMode(null);
    };

    const handleEditClick = async () => {
        if (editingMode === 'editName') {
            if(name === '') return;
            const results = await editChatRoom(actionId, name);
            console.log(results);
            setName('');
            onClose();
            window.location.reload();
        }
        setEditingMode(null);
    };


    const handleClose = () => {
        setEditingMode(null);
        setName('');
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content-edit">
                        <button className="edit-close-btn" onClick={handleClose}>&times;</button>
                        <h2>{actionTitle} {editingMode === 'delete' ? '삭제하기' : editingMode === 'editName' ? '제목을 바꿔보세요!' : ''}</h2>
                        {editingMode ? (
                            <>
                                {editingMode === 'delete' ? (
                                    <>
                                        <p>정말로 삭제하시겠습니까?</p>
                                        <div className="modal-actions">
                                            <button onClick={handleConfirmClick}>예</button>
                                            <button onClick={handleClose}>아니오</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <input className="input-edit"
                                            type="text"
                                            placeholder="내용을 입력하세요"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="modal-actions">
                                            <button onClick={handleEditClick}>수정하기</button>
                                            <button onClick={handleClose}>취소</button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="modal-actions">
                                <button onClick={handleDeleteClick}>삭제하기</button>
                                <button onClick={handleEditNameClick}>이름 수정</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default EditChatModal;
