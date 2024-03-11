import React, { useState, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../cssfiles/chatPage.css';
import PdfViewer from '../jsxfiles/pdfViewer';
import NewChatModal from '../jsxfiles/newchatModal';
import { getChatResponse } from '../api/getChatResponse';
import { postChatContent} from "../api/postChatContent";


const ChatPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);
    const [newChatButtons, setNewChatButtons] = useState([]);
    const dividerRef = useRef(null);
    const middlePanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const [messages, setMessages] = useState([
        { id: 1, text: "안녕하세요! 챗봇입니다.", sender: "received" },
        { id: 2, text: "무엇을 도와드릴까요?", sender: "received" }
    ]);

    const handleLogout = () => {
        setIsLogin(false);
        navigate('/rlogin');
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
    const handleSendMessage = async (event) => {
        event.preventDefault();
        const messageText = event.target.elements.message.value;
        if (messageText.trim()) {
            const newMessage = { id: messages.length + 1, text: messageText, sender: "sent" };
            setMessages([...messages, newMessage]);

            // 백엔드로 채팅 내용 전송
            const success = await postChatContent(messageText);
            if (!success) {
               ;
                console.error('Failed to send message to the backend');
            } else {
                // 백엔드로부터 대답 받아오기
                const response = await getChatResponse(messageText);
                if (response) {
                    const newResponse = { id: messages.length + 2, text: response, sender: "received" };
                    setMessages([...messages, newResponse]);
                } else {
                    console.error('Failed to get chat response from the backend');
                }
            }

            event.target.elements.message.value = '';
        }
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
        // 버튼을 맨 앞에 추가하기 위해 기존 버튼 배열 앞에 새로운 버튼을 추가합니다.
        setNewChatButtons(prevButtons => [newButton, ...prevButtons]);
    };


    const pdfUrl = `https://www.kwdi.re.kr/flexer/view.jsp?FileDir=/CM005&SystemFileName=CM0009_66_1&ftype=pdf&FileName=%EC%97%AC%EC%84%B1%EC%97%B0%EA%B5%AC%EB%85%BC%EB%AC%B8_89-2_(0107_%ED%95%A9%EB%B3%B8%EC%B5%9C%EC%A2%85).pdf`;

    return (
        <div className="chat-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="chat-left-panel">
                <Link to="/main" className="home-btn"></Link>
                <div className="chat-room-list" style={{flexGrow: 1, overflowY: 'auto'}}>

                    {chatList.slice(0).reverse().map((chat, index) => (
                        <div className="chat-room">
                            <button style={{width: '100%', height: '70px'}} className="chat-message"
                                    key={index}>{chat.title}</button>
                        </div>
                    ))}

                    <div className="chat-room">
                        <button className="chat-message" onClick={handlePdfViewer} style={{width: '100%'}}>PDF 보기
                        </button>
                    </div>
                </div>
                <button onClick={handleNewChat} className="newchat-btn">새 채팅</button>
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
                    <textarea className="chat-input" name="message" type="text" placeholder="메시지 입력..."/>
                    <button className="chat-submit-button">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>

            </div>
            {showNewChatModal && <NewChatModal onClose={() => setShowNewChatModal(false)} setChatList={setChatList} onNewChatButton={handleNewChatButton} />}
        </div>
    );
};

export default ChatPage;
