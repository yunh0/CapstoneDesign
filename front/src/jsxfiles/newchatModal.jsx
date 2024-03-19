import React, { useState } from 'react';
import '../cssfiles/newchatModal.css';
import { postInsuranceTerms } from '../api/postInsuranceTerms';
import { getUserChatRooms} from "../api/createChatRoom";

const NewChatModal = ({ onClose, setChatList }) => {
    const [title, setTitle] = useState('');
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insuranceTerms, setInsuranceTerms] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleInsuranceTypeChange = (e) => {
        setInsuranceType(e.target.value);
        setInsuranceCompany('');
        setInsuranceTerms('');
    };

    const handleInsuranceCompanyChange = (e) => {
        setInsuranceCompany(e.target.value);
        const terms = `${e.target.value}${insuranceType}`;
        setInsuranceTerms(terms);
    };

    const handleInsuranceTermsChange = (e) => {
        setInsuranceTerms(e.target.value);
    };

    const handleSubmit = async () => {
        if (title.trim() === '') {
            alert('제목을 입력해 주세요!');
        } else if (insuranceTerms === '') {
            alert('옵션을 선택해 주세요!');
        } else {
            const newChat = { title, insuranceTerms };
            setChatList(prevChatList => [...prevChatList, newChat]);
            onClose();

            // Post insurance terms to the backend
            const success = await postInsuranceTerms(newChat);
            if (success) {
                console.log('Insurance terms posted successfully.');
            } else {
                console.error('Failed to post insurance terms.');
            }
        }
        try {
            const token = localStorage.getItem('token');
            const chatRooms = await getUserChatRooms(token);
            if (chatRooms && chatRooms.length > 0) {
                // 각 채팅방 객체에 필요한 속성 할당
                const updatedChatList = chatRooms.map(chatRoom => ({
                    id: chatRoom.chatRoomId,
                    title: chatRoom.chatRoomName,
                    pdfUrl: chatRoom.filePath
                }));
                setChatList(updatedChatList);
            } else {
                // 필요한 처리를 추가하세요 (채팅방이 없는 경우)
            }
        } catch (error) {
            console.error('채팅방 목록을 불러오는 중 오류가 발생했습니다:', error.message);
            alert('채팅방 목록을 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
        }
    };


    return (
        <div className="newchat-modal">
            <div className="newchat-modal-content">
                <span className="newchat-close" onClick={onClose}>&times;</span>
                <h2>새 채팅 만들기</h2>
                <label htmlFor="newchat-input">제목</label>
                <input id="newchat-input" className="newwchat-input" type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력하세요" />

                <label>보험 종류</label>
                <div>
                    <input type="radio" name="insuranceType" value="자동차" checked={insuranceType === "자동차"} onChange={handleInsuranceTypeChange} />
                    <label>자동차</label>
                    <input type="radio" name="insuranceType" value="암" checked={insuranceType === "암"} onChange={handleInsuranceTypeChange} />
                    <label>암</label>
                    <input type="radio" name="insuranceType" value="실손의료" checked={insuranceType === "실손의료"} onChange={handleInsuranceTypeChange} />
                    <label>실손의료</label>
                    <input type="radio" name="insuranceType" value="화재" checked={insuranceType === "화재"} onChange={handleInsuranceTypeChange} />
                    <label>화재</label>
                    <input type="radio" name="insuranceType" value="연금" checked={insuranceType === "연금"} onChange={handleInsuranceTypeChange} />
                    <label>연금</label>
                </div>

                {insuranceType && (
                    <div>
                        <label>보험사</label>
                        <div>
                            <input type="radio" name="insuranceCompany" value="A" checked={insuranceCompany === "A"} onChange={handleInsuranceCompanyChange} />
                            <label>A</label>
                            <input type="radio" name="insuranceCompany" value="B" checked={insuranceCompany === "B"} onChange={handleInsuranceCompanyChange} />
                            <label>B</label>
                            <input type="radio" name="insuranceCompany" value="C" checked={insuranceCompany === "C"} onChange={handleInsuranceCompanyChange} />
                            <label>C</label>
                        </div>

                        {insuranceCompany && (
                            <div>
                                <label>보험약관</label>
                                <div>
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const term = `${insuranceCompany}${insuranceType}${i + 1}`;
                                        return (
                                            <div key={i}>
                                                <input type="radio" name="insuranceTerms" value={term} checked={insuranceTerms === term} onChange={handleInsuranceTermsChange} />
                                                <label>{term}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <button className="newchat-ok" onClick={handleSubmit}>확인</button>
            </div>
        </div>
    );
};

export default NewChatModal;