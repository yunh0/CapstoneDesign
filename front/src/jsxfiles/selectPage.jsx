import React, { useState } from 'react';
import '../cssfiles/selectPage.css';
import { postInsuranceTerms } from '../api/postInsuranceTerms';
import { getUserChatRooms} from "../api/getChatRoom";
import { useNavigate } from 'react-router-dom';


const SelectPage = ({ onChatRoomCreated }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [title, setTitle] = useState(''); // 채팅방 제목 상태 추가
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insuranceTerms, setInsuranceTerms] = useState('');
    const [confirmationStep, setConfirmationStep] = useState(false);
    const [chatList, setChatList] = useState([]);

    const goToNextStep = () => {
        setCurrentStep(currentStep + 1);
    };
    const handleTitleInput = (e) => {
        setTitle(e.target.value);
    };

    const selectType = (type) => {
        setInsuranceType(type);
        goToNextStep();
    };

    const selectCompany = (company) => {
        setInsuranceCompany(company);
        goToNextStep();
    };

    const selectTerms = (plan) => {
        setInsuranceTerms(plan);
        goToNextStep();
        setConfirmationStep(true);
    };
    const modifySelection = () => {
        // 선택 수정을 위해 단계를 리셋합니다.
        setCurrentStep(1);
        setConfirmationStep(false);
    };
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
    const handleFinalSelection = async () => {
        const newChat = { title, insuranceTerms };
        const success = await postInsuranceTerms(newChat);
        if (success) {
            console.log('Insurance terms posted successfully.');
            // 채팅 목록 업데이트
            updateChatList(); // 채팅방 목록을 업데이트하는 함수를 호출
            onChatRoomCreated?.(); // 채팅방 생성 후 콜백 호출
            navigate('/chat'); // 예: 사용자를 메인 페이지로 리디렉션
        } else {
            console.error('Failed to post insurance terms.');
        }

    };


    return (
        <div className="select-container">
            {currentStep === 0 && (
                <div className="step-container">
                    <h2>CHAT ROOM TITLE</h2>
                    <input
                        type="text"
                        placeholder="Enter chat room title..."
                        value={title}
                        onChange={handleTitleInput}
                    />
                    <button onClick={goToNextStep} disabled={!title}>Next</button>
                </div>
            )}
            {currentStep === 1 && (
                <div className="step-container">
                    <h2>INSURANCE TYPE</h2>
                    <p>선택하고 싶은 계약의 종류를 선택하세요.</p>
                    <div className = "step-buttons">
                        <button onClick={() => selectType('암 보험')}>암 보험</button>
                        <button onClick={() => selectType('화재 보험')}>화재 보험</button>
                        <button onClick={() => selectType('연금 보험')}>연금 보험</button>
                        <button onClick={() => selectType('실비 보험')}>실비 보험</button>
                        <button onClick={() => selectType('자동차 보험')}>자동차 보험</button>

                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className="step-container">
                    <h2>INSURANCE COMPANY</h2>
                    <p>선택한 {insuranceType}의 보험사를 선택하세요.</p>
                    <div className="step-buttons">
                        <button onClick={() => selectCompany('KB손해보험')}>KB손해보험</button>
                        <button onClick={() => selectCompany('현대해상')}>현대해상</button>
                        <button onClick={() => selectCompany('라이나생명')}>라이나생명</button>
                    </div>
                    <button onClick={() => setCurrentStep(currentStep - 1)} className="back-button">
                        <i className="fas fa-arrow-left"></i> {/* Font Awesome 아이콘 */}
                    </button>
                </div>
            )}
            {currentStep === 3 && (
                <div className="step-container">
                    <h2>INSURANCE</h2>
                    <p>선택한 {insuranceCompany}의 보험 중에서 {insuranceType}을 선택하세요.</p>
                    <div className="step-buttons">
                        <button onClick={() => selectTerms('A자동차1')}>A자동차1</button>
                        <button onClick={() => selectTerms('보험 B')}>보험 B</button>
                        <button onClick={() => selectTerms('보험 C')}>보험 C</button>
                    </div>
                    <div>
                        <button onClick={() => setCurrentStep(currentStep - 1)} className="back-button">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    </div>
                </div>
            )}

            {confirmationStep && (
                <div className="confirmation-container">
                    <h2>SELECTED INSURANCE</h2>
                    <div className="confirmation-summary">
                        <p>채팅방 이름: <strong>{title}</strong></p>
                        <p>보험 종류: <strong>{insuranceType}</strong></p>
                        <p>보험사: <strong>{insuranceCompany}</strong></p>
                        <p>보험: <strong>{insuranceTerms}</strong></p>
                        <p>선택하신 보험이 맞습니까?</p>
                    </div>
                    <div className="confirmation-buttons">
                        <button onClick={modifySelection} className="no-button">NO</button>
                        <button onClick={handleFinalSelection} className="yes-button">YES</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectPage;
