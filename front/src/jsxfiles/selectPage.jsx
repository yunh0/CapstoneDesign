import React, { useState } from 'react';
import '../cssfiles/selectPage.css';
import { postInsuranceTerms } from '../api/postInsuranceTerms';
import { getUserChatRooms} from "../api/getChatRoom";
import { useNavigate } from 'react-router-dom';


const SelectPage = ({ onChatRoomCreated }) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [title, setTitle] = useState(''); // 채팅방 제목 상태 추가
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insuranceTerms, setInsuranceTerms] = useState('');
    const [confirmationStep, setConfirmationStep] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [pdfPath, setPdfPath] = useState('');

    const insuranceCompaniesByType = {
        '암 보험': ['암보험사1', '암보험사2', '암보험사3'],
        '화재 보험': ['화재보험사1', '화재보험사2', '화재보험사3'],
        '연금 보험': ['연금보험사1', '연금보험사2', '연금보험사3'],
        '실비 보험': ['실비보험사1', '실비보험사2', '실비보험사3'],
        '자동차 보험': ['자동차보험사1', '자동차보험사2', '자동차보험사3'],
    };

    // 보험사와 보험 종류에 따른 보험 상품 목록
    const insuranceTermsByCompanyAndType = {
        '암 보험': {
            '암보험사1': ['암보험사1보험1', '암보험사1보험2', '암보험사1보험3'],
            '암보험사2': ['암보험사2보험1', '암보험사2보험2', '암보험사2보험3'],
            '암보험사3': ['암보험사3보험1', '암보험사3보험2', '암보험사3보험3'],
        },
        '화재 보험': {
            '화재보험사1': ['화재보험사1보험1', '화재보험사1보험2', '화재보험사1보험3'],
            '화재보험사2': ['화재보험사2보험1', '화재보험사2보험2', '화재보험사2보험3'],
            '화재보험사3': ['화재보험사3보험1', '화재보험사3보험2', '화재보험사3보험3'],
        },
        '연금 보험': {
            '연금보험사1': ['연금보험사1보험1', '연금보험사1보험2', '연금보험사1보험3'],
            '연금보험사2': ['연금보험사2보험1', '연금보험사2보험2', '연금보험사2보험3'],
            '연금보험사3': ['연금보험사3보험1', '연금보험사3보험2', '연금보험사3보험3'],
        },
        '실비 보험': {
            '실비보험사1': ['실비보험사1보험1', '실비보험사1보험2', '실비보험사1보험3'],
            '실비보험사2': ['실비보험사2보험1', '실비보험사2보험2', '실비보험사2보험3'],
            '실비보험사3': ['실비보험사3보험1', '실비보험사3보험2', '실비보험사3보험3'],
        },
        '자동차 보험': {
            '자동차보험사1': ['자동차보험사1보험1', '자동차보험사1보험2', '자동차보험사1보험3'],
            '자동차보험사2': ['자동차보험사2보험1', '자동차보험사2보험2', '자동차보험사2보험3'],
            '자동차보험사3': ['자동차보험사3보험1', '자동차보험사3보험2', '자동차보험사3보험3'],
        },
    };

    const availableCompanies = insuranceType ? insuranceCompaniesByType[insuranceType] : [];
    const availableTerms = insuranceType && insuranceCompany ? insuranceTermsByCompanyAndType[insuranceType][insuranceCompany] : [];

    const goToNextStep = () => {
        if (currentStep >= 4) { // 4단계에서 Next 버튼을 눌렀을 때 최종 확인 단계로 이동
            setCurrentStep(5);
        } else {
            setCurrentStep(currentStep + 1);
        }
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

    const selectTerms = (plan, pdfPath) => {
        setInsuranceTerms(plan);
        setPdfPath(pdfPath); // PDF 경로 설정
        goToNextStep();
        setConfirmationStep(true);
    };
    const modifySelection = () => {
        // 선택 수정을 위해 단계를 리셋합니다.
        setCurrentStep(1);
        setTitle('');
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
            navigate('/chat', { state: { pdfPath } });
        } else {
            console.error('Failed to post insurance terms.');
        }

    };


    return (
        <div className="select-container">
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
                        {availableCompanies.map(company => (
                            <button key={company} onClick={() => selectCompany(company)}>{company}</button>
                        ))}
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
                        {availableTerms.map(term => (
                            <button key={term} onClick={() => selectTerms(term, 'PDF_PATH')}>{term}</button>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => setCurrentStep(currentStep - 1)} className="back-button">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    </div>
                </div>
            )}
            {currentStep === 4 && (
                <div className="step-container">
                    <h2>CHAT ROOM TITLE</h2>
                    <input
                        type="text"
                        placeholder="Enter chat room title..."
                        value={title}
                        onChange={handleTitleInput}
                    />
                    <button onClick={goToNextStep} disabled={!title} className="next-button">Next</button>
                </div>
            )}
            {currentStep === 5 && ( // 최종 확인 단계
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