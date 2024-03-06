import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../cssfiles/chatPage.css';
import PdfViewer from '../jsxfiles/pdfViewer';
import NewChatModal from '../jsxfiles/newchatModal';

const ChatPage = () => {
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);
    const [newChatButtons, setNewChatButtons] = useState([]);

    const dividerRef = useRef(null);
    const middlePanelRef = useRef(null);
    const rightPanelRef = useRef(null);

    const handleLogout = () => {
        // 로그아웃 로직 추가
    };

    const handleNewChat = () => {
        setShowNewChatModal(true);
    };

    const handlePdfViewer = () => {
        setShowPdfViewer(true);
    };

    const handleMouseDown = (e) => {
        setDragging(true);
        setPositionX(e.clientX);
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            const dx = e.clientX - positionX;
            setPositionX(e.clientX);
            const middlePanelWidth = middlePanelRef.current.offsetWidth;
            const rightPanelWidth = rightPanelRef.current.offsetWidth;
            middlePanelRef.current.style.width = `${middlePanelWidth + dx}px`;
            rightPanelRef.current.style.width = `${rightPanelWidth - dx}px`;
            middlePanelRef.current.style.overflow = 'hidden';
            rightPanelRef.current.style.overflow = 'hidden';
        }
    };

    const handleNewChatButton = (title) => {
        const newButton = { title };
        setNewChatButtons(prevButtons => [ newButton,...prevButtons]);
    };

    const pdfUrl = `https://www.kwdi.re.kr/flexer/view.jsp?FileDir=/CM005&SystemFileName=CM0009_66_1&ftype=pdf&FileName=%EC%97%AC%EC%84%B1%EC%97%B0%EA%B5%AC%EB%85%BC%EB%AC%B8_89-2_(0107_%ED%95%A9%EB%B3%B8%EC%B5%9C%EC%A2%85).pdf`;

    return (
        <div className="chat-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="chat-left-panel">
                <Link to="/main" className="home-btn">홈</Link>
                <div className="button-wrapper">
                    {chatList.map((chat, index) => (
                        <button key={index}>{chat.title}</button>
                    ))}
                    <button onClick={handlePdfViewer} className="chatchat">보험회사 PDF</button>
                    {newChatButtons.map((button, index) => (
                        <button key={index}>{button.title}</button>
                    ))}
                </div>
                <button onClick={handleNewChat} className="newchat-btn">새 채팅</button>
                <button onClick={handleLogout} className="logout-btn">로그아웃</button>
            </div>
            <div ref={middlePanelRef} className="chat-panel">
                <div className="chat-middle-content">
                    <span>Middle Panel</span>
                </div>
                {showPdfViewer && <PdfViewer pdfUrl={pdfUrl} style={{width: '100%', height: '96%'}}/>}
            </div>
            <div ref={dividerRef} className="divider" onMouseDown={handleMouseDown}></div>
            <div ref={rightPanelRef} className="chat-panel"> Right Panel </div>
            {showNewChatModal && <NewChatModal onClose={() => setShowNewChatModal(false)} setChatList={setChatList} onNewChatButton={handleNewChatButton} />}
        </div>
    );
};

export default ChatPage;
