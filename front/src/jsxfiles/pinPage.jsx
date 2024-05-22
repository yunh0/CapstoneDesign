import React, { useEffect, useState } from 'react';
import '../cssfiles/pinPage.css';
import { getPinMessages } from "../api/getPinMessages";

const PinPage = () => {
    const [activeContract, setActiveContract] = useState([]);
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [contracts, setContracts] = useState({});
    // 계약서 유형 선택 상태 추가
    const [selectedType, setSelectedType] = useState("all");

    const getPinM = async () => {
        try {
            const messages = await getPinMessages();
//메시지가 존재하고 길이가 0보다 큰 경우
            if (messages && messages.length > 0) {
                //메시지를 파일명에 따라 그룹화
                const groupedMessages = messages.reduce((groups, message) => {
                    const key = message.fileName;
                    if (!groups[key]) {
                        groups[key] = [];
                    }
                    groups[key].push(message);
                    return groups;
                }, {});

                const updatedContracts = {};
                // 파일명에 따라 배열로 변환
                Object.keys(groupedMessages).forEach((fileName, index) => {
                   //updatedContracts 객체를 업데이트
                    updatedContracts[fileName] = groupedMessages[fileName].map(message => ({
                        content: message.content,
                        // 상세 정보
                        detail: message.detail,
                        // fetchedType
                        fetchedType: message.fetchedType
                    }));
                });

                setMessageList(messages);
                setContracts(updatedContracts);
            } else {
                console.log("핀 목록이 비어있습니다.")
            }
        } catch (error) {
            console.error('Error while fetching pinned messages:', error.message);
            alert('An error occurred while fetching pinned messages. Please try again later.');
        }
    };
//컴포넌트가 처음 렌더링될 때 getPinM 함수 호출
    useEffect(() => {
        getPinM();
    }, []);
//특정 파일명을 클릭했을 때 해당 계약을 activeContract 상태로 설정
    const handleClick = (fileName) => {
        setActiveContract(contracts[fileName]);
    };
//특정 답변을 클릭했을 때 모달을 열고 내용을 설정
    const handleAnswerClick = (answer) => {
        setModalContent(answer.content); // 상세 내용으로 변경
        setIsModalOpen(true);
    };
//모달닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };
//선택된 타입을 변경
    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    return (
        <div className="pin-page">
            <div className="pin-panel">
                <h2 className="pin-page-title">Pinned Answers</h2>
                <div className="contracts">
                    <select value={selectedType} onChange={handleTypeChange}>
                        <option value="all">All</option>
                        <option value="암 보험">암 보험</option>
                        <option value="화재 보험">화재 보험</option>
                        <option value="연금 보험">연금 보험</option>
                        <option value="펫 보험">펫 보험</option>
                        <option value="자동차 보험">자동차 보험</option>
                    </select>
                    {/*contracts 객체의 각 키에 대해 계약서 버튼을 표시*/}
                    {Object.keys(contracts).map((fileName, index) => {
                        const contractsWithSelectedType = contracts[fileName].filter(contract => contract.fetchedType === selectedType);
                        // 선택된 타입에 해당하는 계약서만 표시
                        if (selectedType === "all" || contractsWithSelectedType.length > 0) {
                            return (
                                <button key={index} onClick={() => handleClick(fileName)} className="contract-button">
                                    {fileName}
                                </button>
                            );
                        } else {
                            return null; // 선택된 fetchedType에 해당하지 않는 경우 표시하지 않음
                        }
                    })}
                </div>
                <div className="gallery-view">
                    {/*activeContract가 존재하는 경우, 각 답변을 pinned-answer 클래스명을 가진 div 요소로 렌더링하고 클릭 이벤트를 추가*/}
                    {activeContract ? (
                        activeContract.map((answer, index) => (
                            <div key={index} className="pinned-answer" onClick={() => handleAnswerClick(answer)}>
                                <strong>{answer.content}</strong>
                                <p>{answer.detail}</p>
                            </div>
                        ))
                    ) : (
                        //activeContract가 존재하지 않는 경우
                        <div className="pinned-answer" style={{ textAlign: 'center', fontSize: '24px', color: '#7f8c8d', padding: '20px' }}>
                            Please select a contract!
                        </div>
                    )}
                </div>
                {/*모달 생성*/}
                {isModalOpen && (
                    <div className="modal" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            <p>{modalContent}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default PinPage;