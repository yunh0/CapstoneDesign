import React, { useEffect, useState } from 'react';
import '../cssfiles/pinPage.css';
import { getPinMessages } from "../api/getPinMessages";

const PinPage = () => {
    const [activeContract, setActiveContract] = useState([]);
    const [expandedId, setExpandedId] = useState(null); // State to keep track of expanded item
    const [contracts, setContracts] = useState({});
    const [selectedType, setSelectedType] = useState("all");  // 계약서 유형 선택 상태 추가

    const trimText = (text, maxChars = 300) => {
        return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
    };

    const toggleExpand = (index) => {
        setExpandedId(expandedId === index ? null : index);
    };

    const handleClick = (fileName) => {
        setActiveContract(contracts[fileName]);
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
                        fetchedType: message.fetchedType
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
            <h2 className="pin-page-title">Pinned Answers</h2>
            <select value={selectedType} onChange={handleTypeChange} className="dropdown-select">
                <option value="all">All</option>
                <option value="암 보험">암 보험</option>
                <option value="화재 보험">화재 보험</option>
                <option value="연금 보험">연금 보험</option>
                <option value="펫 보험">펫 보험</option>
                <option value="자동차 보험">자동차 보험</option>
            </select>
            <div className="contracts">
                {/* contracts 객체의 각 키에 대해 계약서 버튼을 표시 */}
                {Object.keys(contracts).map((fileName, index) => {
                    const contractsWithSelectedType = contracts[fileName].filter(contract => contract.fetchedType === selectedType);
                    // 선택된 fetchedType인 계약서만 표시
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
                {activeContract.map((answer, index) => (
                    <div key={index} className="pinned-answer" onClick={() => toggleExpand(index)}>
                        <p>{expandedId === index ? answer.content : trimText(answer.content, 300)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PinPage;
