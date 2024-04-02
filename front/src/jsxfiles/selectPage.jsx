import React, { useState,useEffect } from 'react';
import '../cssfiles/selectPage.css';
import { postInsuranceTerms } from '../api/postInsuranceTerms';
import { getUserChatRooms} from "../api/getChatRoom";
import { getInsuranceType} from "../api/getInsuranceType";
import { getInsuranceCompany } from "../api/getInsuranceCompany";
import { getInsuranceTerms } from "../api/getInsuranceTerms"
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;

const fileTable = [
    { id: 1, type: '암 보험', company: 'KB손해보험', plan: '보험 A', path: '/path/to/암보험-KB손해보험-A.pdf' },
    { id: 2, type: '화재 보험', company: '현대해상', plan: '보험 B', path: '/path/to/화재보험-현대해상-B.pdf' },
    // 추가 데이터...
];

const SelectPage = ({ onChatRoomCreated }) => {
    const navigate = useNavigate();

    const [insuranceData, setInsuranceData] = useState({
        types: [], // Holds all insurance types
        companies: {}, // Maps type to companies
        terms: {}, // Maps company to terms under a type
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insurancePlan, setInsurancePlan] = useState('');
    const [confirmationStep, setConfirmationStep] = useState(false);
    const [selectedPath, setSelectedPath] = useState('');


    useEffect(() => {
        const fetchInsuranceInfo = async () => {
            const fetchedType = await getInsuranceType();
            console.log("fetched type: ", fetchedType);
            if (fetchedType && Array.isArray(fetchedType)) {
                setInsuranceData(prev => ({
                    ...prev,
                    types: fetchedType,
                }));
            }
        };
        fetchInsuranceInfo();

    }, []);



    const renderInsuranceTypes = () => {
        return insuranceData.types.map(type => (
            <button key={type} onClick={() => selectType(type)}>{type}</button>
        ));
    };


    const renderInsuranceCompanies = () => {
        const companies = insuranceData.companies[insuranceType] || []; // Use the selected type
        return companies.map((company, index) => (
            <button key={index} onClick={() => selectCompany(company)}>{company}</button>
        ));
    };

    const renderInsuranceTerms = () => {
        // Accessing terms based on the selected type and company
        const terms = insuranceData.terms[insuranceType]?.[insuranceCompany] || [];
        console.log("rendering insurance terms: ", terms);
        return terms.map((term, index) => (
            <button key={index} onClick={() => selectTerms(term)}>{term}</button>
        ));
    };

    const goToNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const selectType = async (type) => {
        setInsuranceType(type);
        const companies = await getInsuranceCompany(type); // Pass the selected type
        if (companies) {
            setInsuranceData(prev => ({
                ...prev,
                companies: { ...prev.companies, [type]: companies },
            }));
        }
        goToNextStep();
    };

    const selectCompany = async (company) => {
        setInsuranceCompany(company);
        // Fetch terms based on type and company
        const terms = await getInsuranceTerms(insuranceType, company);
        setInsuranceData(prev => ({
            ...prev,
            terms: { ...prev.terms, [insuranceType]: { ...prev.terms[insuranceType], [company]: terms } },
        }));
        goToNextStep();
    };

    const selectTerms = async (term) => {
        setInsuranceTerms(term);
        goToNextStep();
        setConfirmationStep(true); // 사용자가 계획을 선택하면 확인 단계로 넘어갑니다.
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
            navigate('/chat', { state: { pdfPath } });
            console.log("pdf Path is ", pdfPath);
        } else {
            alert('해당하는 계약서를 찾을 수 없습니다.');
        }
    };

    return (
        <div className="select-container">
            {currentStep === 1 && (
                <div className="step-container">
                    <h2>INSURANCE TYPE</h2>
                    <p>선택하고 싶은 계약의 종류를 선택하세요.</p>
                    <div className = "step-buttons">
                        {renderInsuranceTypes()}
                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className="step-container">
                    <h2>INSURANCE COMPANY</h2>
                    <p>선택한 {insuranceType}의 보험사를 선택하세요.</p>
                    <div className="step-buttons">
                        {renderInsuranceCompanies()}
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
                        {renderInsuranceTerms()}
                    </div>
                    <div>
                        <button onClick={() => setCurrentStep(currentStep - 1)} className="back-button">
                            <i className="fas fa-arrow-left"></i> {/* Font Awesome 아이콘 */}
                        </button>
                    </div>
                </div>
            )}
            {confirmationStep && (
                <div className="confirmation-container">
                    <h2>SELECTED INSURANCE</h2>
                    <div className="confirmation-summary">
                        <p>보험 종류: <strong>{insuranceType}</strong></p>
                        <p>보험사: <strong>{insuranceCompany}</strong></p>
                        <p>보험: <strong>{insurancePlan}</strong></p>
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
