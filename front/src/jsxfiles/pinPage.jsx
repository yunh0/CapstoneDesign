import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssfiles/pinPage.css';
import { getPinMessages } from "../api/getPinMessages";

const PinPage = () => {
    const navigate = useNavigate();
    const [activeContract, setActiveContract] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [contracts, setContracts] = useState({});
    const [selectedType, setSelectedType] = useState("all");

    const handleClick = (fileName) => {
        setActiveContract(contracts[fileName]);
        setExpandedId(null); // 선택된 타입이 바뀔 때 확장된 ID를 초기화
    };

    const trimText = (text, maxChars = 150) => {
        return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
    };

    const toggleExpand = (index) => {
        setExpandedId(expandedId === index ? null : index);
    };

    const getPinM = async () => {
        try {
            const token = localStorage.getItem('token');
            const messages = await getPinMessages(token);
            if (messages && messages.length > 0) {
                const groupedMessages = messages.reduce((groups, message) => {
                    const key = message.fileName;
                    if (!groups[key]) {
                        groups[key] = [];
                    }
                    groups[key].push(message);
                    return groups;
                }, {});

                const updatedContracts = {};
                Object.keys(groupedMessages).forEach((fileName) => {
                    updatedContracts[fileName] = groupedMessages[fileName].map(message => ({
                        content: message.content,
                        detail: message.detail,
                        fetchedType: message.fetchedType,
                        chatRoomId: message.chatRoomId
                    }));
                });

                setContracts(updatedContracts);
            }
        } catch (error) {
            console.error('Error while fetching pinned messages:', error.message);
            alert('An error occurred while fetching pinned messages. Please try again later.');
        }
    };

    useEffect(() => {
        getPinM();
    }, []);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        setActiveContract([]);
    };

    const filteredContracts = (activeContract && selectedType !== "all") ? activeContract.filter(contract => contract.fetchedType === selectedType) : (activeContract || []);

    return (
        <div className="pin-page">
            <h2 className="pin-page-title">PINNED ANSWERS</h2>
            <select value={selectedType} onChange={handleTypeChange} className="dropdown-select">
                <option value="all">전체</option>
                <option value="암 보험">암 보험</option>
                <option value="화재 보험">화재 보험</option>
                <option value="연금 보험">연금 보험</option>
                <option value="펫 보험">펫 보험</option>
                <option value="자동차 보험">자동차 보험</option>
            </select>
            <div className="contracts">
                {Object.keys(contracts).map((fileName, index) => {
                    const contractsWithSelectedType = contracts[fileName].filter(contract => contract.fetchedType === selectedType);
                    if (selectedType === "all" || contractsWithSelectedType.length > 0) {
                        return (
                            <button key={index} onClick={() => handleClick(fileName)} className="contract-button">
                                {fileName}
                            </button>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
            <div className="gallery-view">
                {activeContract.map((answer, index) => (
                    <div key={index} className="pinned-answer" onClick={() => toggleExpand(index)}>
                        <p className="pin-icon">📍</p>
                        {expandedId === index ? (
                            <>
                                <p>{answer.content}</p>
                                <button className="goChatRoomButton" onClick={() => navigate(`/chatroom/${answer.chatRoomId}`)}>Go to Chat Room</button>
                            </>
                        ) : (
                            <p>{trimText(answer.content, 150)}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PinPage;
