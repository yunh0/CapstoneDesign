import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../cssfiles/chatPage.css';
import PdfViewer from '../jsxfiles/pdfViewer';
import SelectPage from "./selectPage";
import { postChatContent } from "../api/postChatContent";
import { getUserChatRooms} from "../api/getChatRoom";
import { sendChatRoomClick } from '../api/sendChatRoomClick';
import {postPinMessage} from "../api/pinMessage";
import {delPinMessages} from "../api/delPinMessages";

const ChatPage = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const pdfPathFromSelectPage = location.state?.pdfPath;

    const [isLogin, setIsLogin] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showSelectPage, setShowSelectPage] = useState(false); // Change to control SelectPage visibility
    const [chatList, setChatList] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);
    const dividerRef = useRef(null);
    const middlePanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const messageInputRef = useRef(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [defaultMessages] = useState([
        { id: 1, text: "안녕하세요! 챗봇입니다.", sender: "received", backid:1 },
        { id: 2, text: "무엇을 도와드릴까요?", sender: "received", backid:1}
    ]);
    const [messages, setMessages] = useState(defaultMessages);
    const [pinnedMessages, setPinnedMessages] = useState([]);

////////////////////////////채팅방 불러오기 및 설정////////////////////////////////////////////

    const fetchChatRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const chatRooms = await getUserChatRooms(token);
            if (chatRooms && chatRooms.length > 0) {
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
        fetchChatRooms();
    }, []);

    const updateChatList = async () => {
        const updatedChatRooms = await getUserChatRooms(/* 필요한 인자 */);
        setChatList(updatedChatRooms);
    };
    ////////////////////////////////////로그아웃///////////////////////////////////////////

    const handleLogout = () => {
        setIsLogin(false);
        navigate('/rlogin');
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
    const handleFormSubmit = (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        handleSendMessage(); // 메시지 전송 함수 호출
    };

    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    const scrollToBottom2 = () => {
        if (chatMessagesRef.current) {
            const scrollHeight = chatMessagesRef.current.scrollHeight;
            const clientHeight = chatMessagesRef.current.clientHeight;
            const maxScrollTop = scrollHeight - clientHeight;
            let scrollTop = chatMessagesRef.current.scrollTop;

            const scrollStep = () => {
                scrollTop += 3; // 조절 가능한 값
                chatMessagesRef.current.scrollTop = scrollTop;
                if (scrollTop < maxScrollTop) {
                    requestAnimationFrame(scrollStep);
                }
            };

            scrollStep();
        }
    };

    const handleSendMessage = async () => {
        // textarea 요소의 값 가져오기
        const messageText = messageInputRef.current.value;
        const chatroomId = selectedChatId;
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        messageInputRef.current.value = 'LOADING........';

        // 메시지가 비어 있는지 확인
        if (!messageText.trim()) {
            return; // 메시지가 비어 있다면 아무것도 하지 않고 함수 종료
        }
        //채팅 메시지를 추가합니다.
        const newMessage = { id: messages.length + 1, text: messageText, sender: "sent", backid: null };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        scrollToBottom();

        // 백엔드로 채팅 내용 전송
        const success = await postChatContent(messageText, chatroomId);

        if (!success) {
            console.error('Failed to send message to the backend');
        } else {
            // 백엔드로부터 대답 받아오기
            if (success) {
                let senderValue = "received";
                if (success.messageType === "PERSON") {
                    senderValue = "sent";
                }
                const newResponse = { id: messages.length + 2, text: success.content, sender: senderValue, backid: success.messageId };
                // 상태 업데이트 시 함수형 업데이트 사용
                setMessages(prevMessages => [...prevMessages, newResponse]);
                scrollToBottom2();
            } else {
                let senderValue = "received";
                const newResponse = { id: messages.length + 2, text: 'Failed to get chat response from the backend', sender: senderValue };
                setMessages(prevMessages => [...prevMessages, newResponse]);
                console.error('Failed to get chat response from the backend');
            }
        }
        messageInputRef.current.value = '';
        setIsLoading(false);

    };

    /////////////////////////////////버튼 생성 후 /////////////////////////////////////

    useEffect(() => {
        if (chatList.length > 0) {
            const lastChat = chatList[chatList.length - 1];
            handleButtonClicked(lastChat);
        }
    }, [chatList.length]);

    ////////////////////////////PDF 관련 부분///////////////////////////////////////////

    useEffect(() => {
        if (pdfPathFromSelectPage) {
            setShowPdfViewer(true);
            setPdfUrl(pdfPathFromSelectPage);
        }
    }, [pdfPathFromSelectPage]);


    const handleButtonClicked = async (chat) => {
        const { id, pdfUrl } = chat;
        if (selectedChatId === id && !isLoading) {
            return;
        }

        setSelectedChatId(id);

        setIsLoading(true);

        try {
            messageInputRef.current.value = 'LOADING........';

            setShowPdfViewer(true);
            setPdfUrl(pdfUrl);
            setMessages(defaultMessages);

            const results = await sendChatRoomClick(id);
            results.forEach(result => {
                let senderValue = result.messageType === "PERSON" ? "sent" : "received";
                const newResponse = { id: messages.length + 1, text: result.content, sender: senderValue, backid: result.messageId,  pinned: result.pinned };

                setMessages(prevMessages => [...prevMessages, newResponse]);
                messageInputRef.current.value = '';
            });
        } catch (error) {
            console.error('Error sending button click to the backend:', error.message);
        } finally {
            setIsLoading(false);
        }

    };


    /////////////////////////////// 핀 기능 ////////////////////////////////////////////

    const handlePinToggle = async (msg) => {
        if (isPinned(msg)) {
            await delhandlePinMessage(msg);
            unpinMessage(msg);
        } else {
            await handlePinMessage(msg);
            pinMessage(msg);
        }
    };

    const handlePinClick = async (msg) => {
        // 핀 상태 토글 함수 호출
        await handlePinToggle(msg);

        // 핀 상태 변경 후 메시지 리스트 업데이트
        const updatedMessages = messages.map(item => {
            if (item.backid === msg.backid) {
                return { ...item, pinned: !item.pinned };
            }
            return item;
        });

        // 메시지 리스트 업데이트
        setMessages(updatedMessages);
    };

    const isPinned = (msg) => {
        return msg.pinned;
    };

    const pinMessage = (msg) => {
        setPinnedMessages([...pinnedMessages, msg]);
    };

    const unpinMessage = (msg) => {
        setPinnedMessages(pinnedMessages.filter(pinnedMsg => pinnedMsg.backid !== msg.backid));
    };

    const handlePinMessage = async (msg) => {
        console.log(msg.backid);
        try {
            const results = await postPinMessage(msg.backid);
            console.log(results);
        } catch (error) {
            console.error('Error sending button click to the backend:', error.message);
        }
    };

    const delhandlePinMessage = async (msg) => {
        console.log(msg.backid);
        try {
            const results = await delPinMessages(msg.backid);
            console.log(results);
        } catch (error) {
            console.error('Error sending button click to the backend:', error.message);
        }
    };

    ////////////////////////////////////화면 UI///////////////////////////////////////////////


    return (
        <div className="chat-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="chat-left-panel">
                <Link to="/main" className="home-btn"></Link>
                <div className="chat-room-list" style={{ flexGrow: 1, overflowY: 'auto' }}>
                    {chatList.slice(0).reverse().map((chat, index) => (
                        <div className="chat-room" key={index}>
                            <button
                                style={{ width: '100%', height: '70px' }}
                                className="chat-message"
                                onClick={() => {
                                    if (showSelectPage) {
                                        alert('보험을 선택하거나 ❌ 버튼을 눌러주세요.');
                                    } else {
                                        handleButtonClicked(chat);
                                    }
                                }}
                                disabled={isLoading}
                            >
                                {chat.title}
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={() => setShowSelectPage(true)} className="newchat-btn"  disabled={isLoading || showSelectPage}>새 채팅</button>
                <button onClick={handleLogout} className="logout-btn"></button>
            </div>
            {showSelectPage ? (
                <div className="select-page-container">
                    <button onClick={() => setShowSelectPage(false)} className="back-btn">
                        ❌
                    </button>
                    <SelectPage
                        updateChatList={updateChatList}
                        onChatRoomCreated={() => {
                            setShowSelectPage(false); // SelectPage 숨기기
                            fetchChatRooms(); // 채팅방 목록 새로고침
                        }}
                    />
                </div>
            ) : (
                <>
                    <Fragment>
                        <div ref={middlePanelRef} className="chat-panel">
                            {showPdfViewer && <PdfViewer pdfUrl={pdfUrl} onMouseMove={handleMouseMove} style={{ width: '100%', height: '96%' }} />}
                        </div>
                        <div ref={dividerRef} className="divider" onMouseDown={handleMouseDown}></div>
                        <div ref={rightPanelRef} className="chat-panel right">
                            <div ref={chatMessagesRef} className="chat-messages">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`chat-message ${msg.sender}`}>
                                        {msg.text}
                                        {msg.id !== 1 && msg.id !== 2 && msg.sender === "received" && (
                                            <button
                                                className={`pin-button ${msg.pinned ? 'pinned' : ''}`}
                                                onClick={() => handlePinClick(msg)}
                                                aria-label={msg.pinned ? "Unpin Message" : "Pin Message"}>
                                                {msg.pinned ? '📍' : '📌'}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-container" onSubmit={handleFormSubmit}>
                    <textarea
                        ref={messageInputRef}
                        className="chat-input"
                        name="message"
                        type="text"
                        disabled={isLoading}
                        placeholder="메시지 입력..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // 기본 엔터 동작 방지
                                handleSendMessage(); // handleSendMessage 호출
                            }
                        }}
                    />
                                <button type="submit" className="chat-submit-button"  disabled={isLoading}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </>
            )}
        </div>
    );
};

export default ChatPage;