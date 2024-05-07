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
import {getfReco} from "../api/getFirstRecommend";
import {getsReco} from "../api/getSecondRecommend";
import {getInsuranceType} from "../api/getInsuranceType";
import {getMyType} from "../api/getMyType";

const ChatPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const pdfPathFromSelectPage = location.state?.pdfPath;
    const [isPlusButtonClicked, setIsPlusButtonClicked] = useState(false);
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
    const [formattedText, setFormattedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [defaultMessages,setDefaultMessages] = useState([
        { id: 1, text: "안녕하세요! 챗봇입니다.", sender: "received", backid:1 },
        { id: 2, text: "", sender: "received", backid:1}
    ]);
    const [messages, setMessages] = useState(defaultMessages);
    const [pinnedMessages, setPinnedMessages] = useState([]);
    const [fnum, setFnum] = useState(0);
    const [isPdfViewerDisabled, setIsPdfViewerDisabled] = useState(false);
    const [isFolded, setIsFolded] = useState(false);
    const [sReco, setSReco] = useState(null);
    const totalPages = (() => {
        if (sReco !== null && sReco !== undefined) {
            if (sReco.first !== null && sReco.second !== null && sReco.third !== null) {
                return 3;
            } else if (sReco.third === null) {
                return 2;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    })();


////////////////////////////채팅방 불러오기 및 설정////////////////////////////////////////////

    const fetchChatRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const chatRooms = await getUserChatRooms(token);
            if (chatRooms && chatRooms.length > 0) {
                const updatedChatList = chatRooms.map(chatRoom => ({
                    id: chatRoom.chatRoomId,
                    title: chatRoom.chatRoomName,
                    pdfUrl: chatRoom.filePath,
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


    useEffect(() => {
        if (formattedText) {
            const messageWithId2Index = messages.findIndex(msg => msg.id === 2);

            if (messageWithId2Index !== -1) {
                setMessages(prevMessages => prevMessages.map((msg, index) => {
                    if (index === messageWithId2Index) {
                        return { ...msg, text: formattedText };
                    }
                    return msg;
                }));
            } else {
                const newMessage = {
                    id: 2,
                    text: formattedText,
                    sender: "received",
                    backid: 1,
                    pinned: false
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
        }
    }, [fnum]);


    ////////////////////////////////////로그아웃///////////////////////////////////////////

    const handleLogout = () => {
        setIsLogin(false);
        navigate('/rlogin');
    };

    //////////////////////////////////경계선 이동/////////////////////////////////////////

    const handleMouseDown = (e) => {
        if (e.target === dividerRef.current) {
            setIsPdfViewerDisabled(true);
            setDragging(true);
            setPositionX(e.clientX);
        }
    };

    const handleMouseUp = () => {
        setIsPdfViewerDisabled(false);
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

    useEffect(() => {
        const handleMouseUp = () => {
            setIsPdfViewerDisabled(false);
        };

        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
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
        const messageText = messageInputRef.current.value;
        const chatroomId = selectedChatId;
        if (isLoading) {
            return;
        }
        setIsPlusButtonClicked(false);

        setIsLoading(true);
        messageInputRef.current.value = 'Sending my question to chatbot...';

        if (!messageText.trim()) {
            return;
        }
        const newMessage = { id: messages.length + 1, text: messageText, sender: "sent", backid: null };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        const loadingMessage = {
            id: messages.length + 1,
            text: <div className="lds-default">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>,
            sender: "received",
            backid: 3
        };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);
        scrollToBottom();
        const success = await postChatContent(messageText, chatroomId);
        if (!success) {
            console.error('Failed to send message to the backend');
        } else {

            if (success) {
                let senderValue = "received";
                if (success.messageType === "PERSON") {
                    senderValue = "sent";
                }
                const newResponse = { id: messages.length + 2, text: success.content, sender: senderValue, backid: success.messageId };
                setMessages(prevMessages => prevMessages.filter(msg => msg.backid !== loadingMessage.backid));
                scrollToBottom2();
                setMessages(prevMessages => [...prevMessages, newResponse]);
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
        setIsPlusButtonClicked(false);
        setIsLoading(true);

        try {
            messageInputRef.current.value = 'LOADING Please wait...';

            setShowPdfViewer(true);
            setPdfUrl(pdfUrl);
            const fReco = await getfReco();
            const formattedText = `사용자들이 많이 검색한 질문이에요!
            1. ${fReco.first ?? ''}
            2. ${fReco.second ?? ''}
            3. ${fReco.third ?? ''}`;
            setFnum(prevFnum => prevFnum === 0 ? 1 : 0);
            setMessages(defaultMessages);
            setFormattedText(formattedText);

            const results = await sendChatRoomClick(id);
            results.forEach(result => {
                let senderValue = result.messageType === "PERSON" ? "sent" : "received";
                const newResponse = { id: messages.length + 1, text: result.content, sender: senderValue, backid: result.messageId,  pinned: result.pinned };

                setMessages(prevMessages => [...prevMessages, newResponse]);
            });
            messageInputRef.current.value = '';
        } catch (error) {
            console.error('Error sending button click to the backend:', error.message);
        } finally {
            setIsLoading(false);
        }

    };

    ///////////////////////////////사이드 바 접기 ////////////////////////////////////////
    const handleFoldButtonClick = () => {
        // 현재 상태의 반대로 변경
        setIsFolded(prevFolded => !prevFolded);
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

        try {
            const fetchedType = await getMyType(selectedChatId);
            const results = await postPinMessage(msg.backid, fetchedType);

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

    //////////////////////////////////// PLUS 버튼 ///////////////////////////////////////////

    const handlePlusButtonClick = async (e) => {
        e.preventDefault();
        if (!isPlusButtonClicked) {
            const sReco = await getsReco(selectedChatId);
            setSReco(sReco);
            if(sReco){
                setIsPlusButtonClicked(!isPlusButtonClicked);
            }
        } else {
            setSReco(null);
            setIsPlusButtonClicked(!isPlusButtonClicked);
        }
    }

    const handleRightButtonClick = () => {
        setCurrentPage(prevPage => (prevPage % totalPages) + 1);
    };

    const handleLeftButtonClick = () => {
        setCurrentPage(prevPage => {
            if (prevPage === 1) {
                return totalPages;
            } else {
                return prevPage - 1;
            }
        });
    };

    ////////////////////////////////////화면 UI///////////////////////////////////////////////


    return (
        <div className="chat-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="chat-left-panel"
                 style={{width: isFolded ? '0%' : '20%', display: isFolded ? 'none' : 'flex'}}>
                <Link to="/main" className="home-btn">
                    <span className="material-symbols-outlined" style={{fontSize: '40px'}}>home</span>
                </Link>
                <button className="newchat-btn" onClick={() => setShowSelectPage(true)}
                        disabled={isLoading || showSelectPage}>New Chat
                    {/*<span className="material-symbols-outlined" style={{ fontSize: '30px', marginLeft:'5px' }}>edit_square</span>*/}
                </button>
                <div className="chat-room-list" style={{flexGrow: 1, overflowY: 'auto'}}>
                    {chatList.slice(0).reverse().map((chat, index) => (
                        <div className="chat-room" key={index}>
                            <button
                                className="chatroom-button"
                                onClick={() => {
                                    if (showSelectPage) {
                                        alert('보험을 선택하거나 뒤로가기 버튼을 눌러주세요.');
                                    } else {
                                        handleButtonClicked(chat);
                                    }
                                }}
                                disabled={isLoading}
                                style={{width: '100%', height: '100%', cursor: 'pointer' }}
                            >
                                {chat.title}
                            </button>
                        </div>
                    ))}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="material-symbols-outlined" style={{fontSize: '40px'}}>logout</span>
                </button>
            </div>
            {showSelectPage ? (
                <div className="select-page-container">
                    <button onClick={() => setShowSelectPage(false)} className="back-btn">
                        <span className="material-symbols-outlined">arrow_back</span>
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
                        <div style={{width: "20px"}}>
                            <button className="foldbtn" style={{width: "100%", height: "100%",  border: 'none'}}
                                    onClick={handleFoldButtonClick}>
                                {isFolded ? '펴기' : '접기'}
                            </button>
                        </div>
                        <div ref={middlePanelRef} className="chat-panel"
                             style={{width: isFolded ? '80%' : '40%', pointerEvents: isPdfViewerDisabled ? 'none' : 'auto'}}>
                            {showPdfViewer && <PdfViewer pdfUrl={pdfUrl}/>}
                        </div>
                        <div ref={dividerRef} className="divider"  onMouseMove={handleMouseMove} onMouseDown={handleMouseDown}></div>
                        <div ref={rightPanelRef} className="chat-panel right" style={{width: isFolded ? '80%' : '40%'}}>
                            <div className="chat-banner">
                                AI Chatbot
                                <span className="material-icons help-button">help_outline</span>
                                <div className="help-modal">
                                    <div className="help-modal-header">채팅 가이드</div>
                                    <div className="help-modal-body">
                                        <p><strong>채팅 시작하기:</strong> 하단의 입력 창에 메시지를 작성하고 엔터 키를 눌러 메시지를 보내세요. 대화가 시작됩니다.
                                        </p>
                                        <p><strong>메시지 핀하기:</strong> 대화 중 중요한 메시지 옆의 📌 아이콘을 클릭하여 메시지를 핀할 수 있습니다.</p>
                                        <p><strong>핀된 메시지 확인하기:</strong> 모든 핀된 메시지는 사이드바의 '핀된 메시지' 섹션에서 확인할 수 있습니다.</p>
                                        <p><strong>핀 해제하기:</strong> 핀된 메시지 옆의 📍 아이콘을 다시 클릭하면 핀을 해제할 수 있습니다.</p>
                                    </div>
                                </div>
                            </div>
                            <div ref={chatMessagesRef} className="chat-messages">
                                {messages.map((msg, index) => (
                                    <div key={index}
                                         className={`chat-message ${msg.sender}  ${msg.id === 1 || msg.id === 2 ? 'special-message' : ''}`}>
                                        {msg.text}
                                        {msg.id !== 1 && msg.id !== 2 && msg.sender === "received"  && msg.backid != 3 && (
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

                            {isPlusButtonClicked && (sReco.first !== null || sReco.second !== null || sReco.third !== null) && (
                                <div className="extra-window">
                                    {sReco.first && currentPage === 1 && (
                                        <>
                                            <p className="exfont">{sReco.first}</p>
                                            <div className="extra-window-buttons">
                                                <button className="extra-window-button left-button"
                                                        onClick={handleLeftButtonClick}>◀️
                                                </button>
                                                <button className="extra-window-button right-button"
                                                        onClick={handleRightButtonClick}>▶️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {sReco.second && currentPage === 2 && (
                                        <>
                                            <p className="exfont">{sReco.second}</p>
                                            <div className="extra-window-buttons">
                                                <button className="extra-window-button left-button"
                                                        onClick={handleLeftButtonClick}>◀️
                                                </button>
                                                <button className="extra-window-button right-button"
                                                        onClick={handleRightButtonClick}>▶️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {sReco.third && currentPage === 3 && (
                                        <>
                                            <p className="exfont">{sReco.third}</p>
                                            <div className="extra-window-buttons">
                                                <button className="extra-window-button left-button"
                                                        onClick={handleLeftButtonClick}>◀️
                                                </button>
                                                <button className="extra-window-button right-button"
                                                        onClick={handleRightButtonClick}>▶️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <form className="chat-input-container" onSubmit={handleFormSubmit}>
                                <div className="plus-button">
                                    <button className="p-button" onClick={handlePlusButtonClick} disabled={isLoading}>
                                        {isPlusButtonClicked ? '➖' : '➕'}
                                    </button>
                                </div>
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
                                <button type="submit" className="chat-submit-button" disabled={isLoading}>
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