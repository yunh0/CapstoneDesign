import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../cssfiles/chatPage.css';
import PdfViewer from '../jsxfiles/pdfViewer';
import NewChatModal from '../jsxfiles/newchatModal';
import { getChatResponse } from '../api/getChatResponse';
import { postChatContent } from "../api/postChatContent";
import { getUserChatRooms} from "../api/createChatRoom";

const ChatPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [chatList, setChatList] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);
    const [newChatButtons, setNewChatButtons] = useState([]);
    const dividerRef = useRef(null);
    const middlePanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([
        { id: 1, text: "안녕하세요! 챗봇입니다.", sender: "received" },
        { id: 2, text: "무엇을 도와드릴까요?", sender: "received" }
    ]);


////////////////////////////채팅방 불러오기 및 설정////////////////////////////////////////////

    const fetchChatRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const chatRooms = await getUserChatRooms(token);
            if (chatRooms && chatRooms.length > 0) {
                // 각 채팅방 객체에 필요한 속성 할당
                const updatedChatList = chatRooms.map(chatRoom => ({
                    id: chatRoom.chatRoomId,
                    title: chatRoom.chatRoomName,
                    pdfUrl: chatRoom.filePath
                }));
                setChatList(updatedChatList);
            } else {
                // 필요한 처리를 추가하세요 (채팅방이 없는 경우)
            }
        } catch (error) {
            console.error('채팅방 목록을 불러오는 중 오류가 발생했습니다:', error.message);
            alert('채팅방 목록을 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
        }
    };
    useEffect(() => {
        fetchChatRooms()
    }, []);

    ////////////////////////////////////로그아웃///////////////////////////////////////////

    const handleLogout = () => {
        setIsLogin(false);
        navigate('/rlogin');
    };

    ////////////////////////////////////새채팅 모달 창////////////////////////////////////////

    const handleNewChat = () => {
        setShowNewChatModal(true);
    };

    //////////////////////////////////경계선 이동/////////////////////////////////////////

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

    ///////////////////////////////메세지 보내기//////////////////////////////////////////////

    const handleSendMessage = async (event) => {
        event.preventDefault();
        const messageText = event.target.elements.message.value;
        const chatroomId = selectedChatId;
        if (messageText.trim()) {
            const newMessage = { id: messages.length + 1, text: messageText, sender: "sent" };
            setMessages([...messages, newMessage]);

            // 백엔드로 채팅 내용 전송
            const success = await postChatContent(messageText, chatroomId);
            if (!success) {
                console.error('Failed to send message to the backend');
            } else {
                // 백엔드로부터 대답 받아오기
                const response = await getChatResponse(messageText, chatroomId);
                if (response) {
                    let senderValue = "received";
                    if (response.messageType === "PERSON") {
                        senderValue = "sent";
                    }
                    const newResponse = { id: messages.length + 2, text: response.text, sender: senderValue };
                    setMessages([...messages, newResponse]);
                } else {
                    console.error('Failed to get chat response from the backend');
                }
            }

            event.target.elements.message.value = '';
        }
    };

    //////////////////////////////////////새 채팅/////////////////////////////
    const handleNewChatButton = (title, id, pdfUrl) => {
        const newButton = { title, id, pdfUrl };
        // 버튼을 맨 앞에 추가하기 위해 기존 버튼 배열 앞에 새로운 버튼을 추가합니다.
        setNewChatButtons(prevButtons => [newButton, ...prevButtons]);
    };

    ////////////////////////////PDF 관련 부분///////////////////////////////////////////

    useEffect(() => {
        if (showPdfViewer) {
            setPdfUrl(null);
        }
    }, [showPdfViewer]);

    const handleButtonClicked = (pdfUrl, chatId) => {
        setPdfUrl(pdfUrl);
        setShowPdfViewer(true);
        setSelectedChatId(chatId);
    };


    ////////////////////////////////////화면 UI///////////////////////////////////////////////


    return (
        <div className="chat-container">
            <div className="chat-left-panel">
                <Link to="/main" className="home-btn"></Link>
                <div className="chat-room-list" style={{ flexGrow: 1, overflowY: 'auto' }}>
                    {chatList.slice(0).reverse().map((chat, index) => (
                        <div className="chat-room" key={index}>
                            <button style={{ width: '100%', height: '70px' }} className="chat-message" onClick={() => { handleButtonClicked(chat.pdfUrl, chat.id); }}>{chat.title}</button>
                        </div>
                    ))}
                </div>
                <button onClick={handleNewChat} className="newchat-btn">새 채팅</button>
                <button onClick={handleLogout} className="logout-btn"></button>
            </div>
            <Fragment>
                <div ref={middlePanelRef} className="chat-panel">
                    <div className="chat-middle-content">
                        <span>Middle Panel</span>
                    </div>
                    {showPdfViewer && <PdfViewer pdfUrl={pdfUrl} style={{ width: '100%', height: '96%' }} />}
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
                        <textarea className="chat-input" name="message" type="text" placeholder="메시지 입력..." />
                        <button className="chat-submit-button">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </Fragment>
            {showNewChatModal && <NewChatModal onClose={() => setShowNewChatModal(false)} setChatList={setChatList} onNewChatButton={handleNewChatButton} />}
        </div>
    );
};

export default ChatPage;