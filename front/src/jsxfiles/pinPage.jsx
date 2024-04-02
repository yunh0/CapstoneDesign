import React, { useEffect, useState } from 'react';
import '../cssfiles/pinPage.css';
import { getPinMessages } from "../api/getPinMessages";

const PinPage = () => {
    const [activeContract, setActiveContract] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const [contracts, setContracts] = useState({});

    ///////////////////////////////핀 불러오기//////////////////////////

    const getPinM = async () => {
        try {
            const token = localStorage.getItem('token');
            const messages = await getPinMessages(token);

            if (messages && messages.length > 0) {
                // Group messages by fileName
                const groupedMessages = messages.reduce((groups, message) => {
                    const key = message.fileName; // Use fileName as key
                    if (!groups[key]) {
                        groups[key] = [];
                    }
                    groups[key].push(message);
                    return groups;
                }, {});

                // Generate contracts based on grouped messages
                const updatedContracts = {};
                Object.keys(groupedMessages).forEach((fileName, index) => {
                    updatedContracts[fileName] = groupedMessages[fileName].map(message => message.content);
                });

                setMessageList(messages);
                setContracts(updatedContracts);
            } else {
                // Handle case when there are no messages
            }
        } catch (error) {
            console.error('Error while fetching pinned messages:', error.message);
            alert('An error occurred while fetching pinned messages. Please try again later.');
        }
    };

    useEffect(() => {
        getPinM();
    }, []);

    const handleClick = (fileName) => {
        setActiveContract(contracts[fileName]);
    };

    const handleAnswerClick = (answer) => {
        setModalContent(answer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <div className="pin-page">
            <h2 className="pin-page-title">Pinned Answers</h2>
            <div className="contracts">
                {Object.keys(contracts).map((fileName, index) => (
                    <button key={index} onClick={() => handleClick(fileName)} className="contract-button">
                        {fileName}
                    </button>
                ))}
            </div>
            <div className="gallery-view">
                {activeContract ? (
                    activeContract.map((answer, index) => (
                        <div key={index} className="pinned-answer" onClick={() => handleAnswerClick(answer)}>
                            {answer}
                        </div>
                    ))
                ) : (
                    <div className="pinned-answer" style={{ textAlign: 'center', fontSize: '24px', color: '#7f8c8d', padding: '20px' }}>
                        Please select a contract!
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <p>{modalContent}</p>
                    </div>
                </div>
            )}
        </div>
    );

};
export default PinPage;
