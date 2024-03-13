import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../cssfiles/chatPage.css';
import PdfViewer from '../jsxfiles/pdfViewer';

const ChatPage = () => {
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);
    const dividerRef = useRef(null);
    const middlePanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const [chatRooms, setChatRooms] = useState(["채팅방 1", "채팅방 2", "채팅방 3"]); // 예시 채팅방 목록
    const [messages, setMessages] = useState([
        { id: 1, text: "안녕하세요! 챗봇입니다.", sender: "received" },
        { id: 2, text: "무엇을 도와드릴까요?", sender: "received" }
    ]);
    const pdfUrl = 'https://direct.kbinsure.co.kr/home/dwlddoc/KB_MagiccarDirect_Private_202304.pdf';



    const handleLogout = () => {
        // 로그아웃 로직 추가
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

    const renderChatRooms = () => {
        return chatRooms.map((room, index) => (
            <div key={index} className="chat-room">
                {room}
            </div>
        ));
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        const messageText = event.target.elements.message.value;
        if (messageText.trim()) {
            const newMessage = { id: messages.length + 1, text: messageText, sender: "sent" };
            setMessages([...messages, newMessage]);
            event.target.elements.message.value = ''; // 입력 필드 초기화
        }
    };


    return (
        <div className="chat-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="chat-left-panel">
                <Link to="/main" className="home-btn"></Link>
                <button onClick={handlePdfViewer} style={{marginTop: "20px"}}>PDF 보기</button>
                <div className="chat-room-list" style={{flexGrow: 1, overflowY: 'auto'}}>
                    {renderChatRooms()}
                </div>
                <button onClick={handleLogout} className="logout-btn"></button>
            </div>
            <div ref={middlePanelRef} className="chat-panel">
                <div className="chat-middle-content">
                    <span>Middle Panel</span>
                </div>
                {showPdfViewer && <PdfViewer pdfUrl={pdfUrl} style={{ width: '100%', height: '96%' }}/>}
            </div>
            <div ref={dividerRef} className="divider" onMouseDown={handleMouseDown}></div>
            <div ref={rightPanelRef} className="chat-panel right">
                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`chat-message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <form className="chat-input-container" onSubmit={handleSendMessage}>
                    <input className="chat-input" name="message" type="text" placeholder="메시지 입력..." />
                    <button className="chat-submit-button">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ChatPage;
