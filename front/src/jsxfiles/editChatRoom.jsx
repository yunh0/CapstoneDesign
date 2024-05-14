import React, { useState } from 'react';
import { delChatRoom } from "../api/delChatRoom";
import {editChatRoom} from "../api/editChatRoom";
import {getUserChatRooms} from "../api/getChatRoom";

const EditChatModal = ({ isOpen, onClose, actionId, actionTitle }) => {
    const [editingMode, setEditingMode] = useState(null);
    const [name, setName] = useState("");
    const [chatList, setChatList] = useState([]);


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
        }
        setEditingMode(null);
    };

    const handleEditClick = async () => {

        if (editingMode === 'editName') {
            if(name == ''){return}
            const results = await editChatRoom(actionId, name);
            console.log(results);
            setName('')
            onClose();
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
                    <div className="modal-content">
                        <button onClick={handleClose}>&times;</button>
                        <h2>{actionTitle} {editingMode === 'delete' ? '삭제하기' : editingMode === 'editName' ? '제목 수정' : 'Edit Page'}</h2>
                        <div>
                            {editingMode ? (
                                <>
                                    {editingMode === 'delete' ? (
                                        <>
                                            <p>정말로 삭제하시겠습니까?</p>
                                            <button onClick={handleConfirmClick}>예</button>
                                            <button onClick={handleClose}>아니오</button>
                                        </>
                                    ) : (
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
