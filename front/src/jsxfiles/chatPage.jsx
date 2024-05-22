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
import {getMyType} from "../api/getMyType";
import {postLogoutToken} from "../api/postLogoutToken";
import EditChatModal from "./editChatRoom";



const ChatPage = () => {
    //페이지를 이동하는 데 사용 navigate 함수 초기화
    const navigate = useNavigate();
    //다음 질문 추천 페이지
    const [currentPage, setCurrentPage] = useState(1);
    //현재 웹 앱의 URL을 나타내는 현재 위치 객체에 접근할 수 있게 함
    const location = useLocation();
    // 현재 페이지의 URL 정보를 가져와서 그 안에 있는 상태 정보에서 PDF 파일 경로를 추출
    const pdfPathFromSelectPage = location.state?.pdfPath;
    //다음 질문 추천 페이지 버튼
    const [isPlusButtonClicked, setIsPlusButtonClicked] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    //pdf뷰어 띄우기
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    //파일 URL
    const [pdfUrl, setPdfUrl] = useState("");
    //보험 선택 페이지 띄우기
    const [showSelectPage, setShowSelectPage] = useState(false);
    const [chatList, setChatList] = useState([]);
    //경계선 드래그
    const [dragging, setDragging] = useState(false);
    //마우스 위치
    const [positionX, setPositionX] = useState(null);
    //분할선을 나타내는 요소에 대한 참조
    const dividerRef = useRef(null);
    //화면 중앙에 위치한 pdf 패널에 대한 참조
    const middlePanelRef = useRef(null);
    //화면 우측에 위치한 채팅 패널에 대한 참조
    const rightPanelRef = useRef(null);
    //채팅 메시지가 표시되는 영역에 대한 참조
    const chatMessagesRef = useRef(null);
    //메시지를 입력하는 입력창에 대한 참조
    const messageInputRef = useRef(null);
    //클릭된 채팅방 아이디
    const [selectedChatId, setSelectedChatId] = useState(null);
    //많이 한 질문
    const [formattedText, setFormattedText] = useState("");
    //채팅방 이름 수정 및 삭제 페이지
    const [EditchatRoom, setEditchatRoom] = useState("");
    //이름 수정 입력
    const [name, setName] = useState("");
    //로딩중
    const [isLoading, setIsLoading] = useState(false);
    //기본 메세지
    const [defaultMessages,setDefaultMessages] = useState([
        { id: 1, text: "안녕하세요! 챗봇입니다.", sender: "received", backid:1 },
        { id: 2, text: "", sender: "received", backid:1}
    ]);
    //메세지 목록
    const [messages, setMessages] = useState(defaultMessages);
    //핀된 메세지 목록
    const [pinnedMessages, setPinnedMessages] = useState([]);
    //많이 한 질문 통신 확인
    const [fnum, setFnum] = useState(0);
    //pdf뷰어 클릭 불가
    const [isPdfViewerDisabled, setIsPdfViewerDisabled] = useState(false);
    //사이드바 접기
    const [isFolded, setIsFolded] = useState(false);
    //다음 질문 추천
    const [sReco, setSReco] = useState(null);
    //수정할 채팅방 아이디
    const [actionId, setactionId] = useState(null);
    //수정할 채팅방 제목
    const [actionTitle, setactionTitle] = useState(null);
    //채팅방 수정 모달창
    const [modalOpen, setModalOpen] = useState(false);
    //다음 질문 추천 페이지 수 설정
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
            const chatRooms = await getUserChatRooms();
            //채팅방들 목록 매핑 후 설정
            if (chatRooms && chatRooms.length > 0) {
                const updatedChatList = chatRooms.map(chatRoom => ({
                    id: chatRoom.chatRoomId,
                    title: chatRoom.chatRoomName,
                    pdfUrl: chatRoom.filePath,
                }));
                setChatList(updatedChatList);
            } else {
                console.log("채팅방이 비어있습니다.")
            }
        } catch (error) {
            console.error('채팅방 목록을 불러오는 중 오류가 발생했습니다:', error.message);
            alert('채팅방 목록을 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
        }
    };
    //컴포넌트가 처음 렌더링될 때 fetchChatRooms 함수 호출
    useEffect(() => {
        fetchChatRooms();
    }, []);

    //채팅방 목록 업데이트
    const updateChatList = async () => {
        try {
            const updatedChatRooms = await getUserChatRooms();
            setChatList(updatedChatRooms);
        } catch (error) {
            console.error('채팅방 목록을 업데이트하는 중 오류가 발생했습니다:', error.message);
            alert('채팅방 목록을 업데이트하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
        }
    };

// 아이디 2인 기본 메세지에 많이 한 질문 리스트 설정
    useEffect(() => {
        if (formattedText) {
            const messageWithId2Index = messages.findIndex(msg => msg.id === 2);
            if (messageWithId2Index !== -1) {
                //id가 2인 메시지가 존재한다면, 해당 메시지의 텍스트를 formattedText로 업데이트
                setMessages(prevMessages => prevMessages.map((msg, index) => {
                    if (index === messageWithId2Index) {
                        return { ...msg, text: formattedText };
                    }
                    return msg;
                }));
            } else {
                //id가 2인 메시지가 존재하지 않는다면, 새로운 메시지 객체를 생성하여 messages 배열에 추가
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
        //fnum 상태가 변경될 때마다 반복
    }, [fnum]);


    ////////////////////////////////////로그아웃///////////////////////////////////////////

    const handleLogout = async () => {
        const success = await postLogoutToken();
        if (success) {
            setIsLogin(false);
            navigate('/');
        } else {
            console.error('로그아웃 요청 실패');
        }
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

    //마우스 버튼이 눌렸다가 떼어질 때의 이벤트를 감지하여 PDF 뷰어를 비활성화
    useEffect(() => {
        //PDF 뷰어를 활성화
        const handleMouseUp = () => {
            setIsPdfViewerDisabled(false);
        };

        //'mouseup' 이벤트에 handleMouseUp 함수를 연결
        document.addEventListener('mouseup', handleMouseUp);

        //컴포넌트가 언마운트될 때 실행되는 클린업 함수를 정의
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    ///////////////////////////////메세지 보내기//////////////////////////////////////////////

    //메세지 전송 버튼 클릭 시
    const handleFormSubmit = (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        handleSendMessage(); // 메시지 전송 함수 호출
    };

    //스크롤 내리기 (빠르게)
    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };
    //스크롤 내리기 (천천히)
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
        //현재 채팅방과 메세지 입력창 내용
        const messageText = messageInputRef.current.value;
        const chatroomId = selectedChatId;
        //로딩중이라면 취소
        if (isLoading) {
            return;
        }
        //다음 질문 추천 페이지 닫기
        setIsPlusButtonClicked(false);
        //로딩중 표시
        setIsLoading(true);
        messageInputRef.current.value = 'Sending my question to chatbot...';
        //공백 시
        if (!messageText.trim()) {
            return;
        }
        //질문 화면에 표시
        const newMessage = { id: messages.length + 1, text: messageText, sender: "sent", backid: null };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        //로딩중일 때 표시
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
        //답변 받고 화면에 표시
        const success = await postChatContent(messageText, chatroomId);
        if (!success) {
            console.error('Failed to send message to the backend');
        } else {
            //답변 받기 성공 시
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
                //답변 받기 실패 시
                let senderValue = "received";
                const newResponse = { id: messages.length + 2, text: 'Failed to get chat response from the backend', sender: senderValue };
                setMessages(prevMessages => [...prevMessages, newResponse]);
                console.error('Failed to get chat response from the backend');
            }


        }
        //메세지 입력창 비우기
        messageInputRef.current.value = '';
        //로딩 중 취소
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

    //해당 채팅방 클릭 함수
    const handleButtonClicked = async (chat) => {
        const { id, pdfUrl } = chat;
        //이미 클릭되었거나 로딩중일 시
        if (selectedChatId === id && !isLoading) {
            return;
        }
        //현재 채팅방 아이디 세팅, 다음질문 추천 페이지 닫기, 로딩중 표시
        setSelectedChatId(id);
        setIsPlusButtonClicked(false);
        setIsLoading(true);

        try {
            messageInputRef.current.value = 'LOADING Please wait...';
            //pdf띄우기
            setShowPdfViewer(true);
            setPdfUrl(pdfUrl);
            //많이 한 질문 추천 세팅
            const fReco = await getfReco(id);
            const formattedText = `사용자들이 많이 검색한 질문유형은 <${fReco.prediction ?? " "}>(이)에요!
<${fReco.prediction ?? " "}> 유형에서 질문을 추천해 드릴게요!
  
${fReco.first ? `1. ${(fReco.first)}` : '아직 존재하지 않아요....'}
${fReco.second ? `2. ${(fReco.second)}` : ''}
${fReco.third ? `3. ${(fReco.third)}` : ''}`;

            setFnum(prevFnum => prevFnum === 0 ? 1 : 0);
            setMessages(defaultMessages);
            setFormattedText(formattedText);
            //과거 채팅 목록 불러오기
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
    //핀 확인에 표시
    const pinMessage = (msg) => {
        setPinnedMessages([...pinnedMessages, msg]);
    };

    const unpinMessage = (msg) => {
        setPinnedMessages(pinnedMessages.filter(pinnedMsg => pinnedMsg.backid !== msg.backid));
    };

    const handlePinMessage = async (msg) => {
        try {
            //채팅방 타입 가져옴
            const fetchedType = await getMyType(selectedChatId);
            const results = await postPinMessage(msg.backid, fetchedType);
        } catch (error) {
            console.error('Error sending button click to the backend:', error.message);
        }
    };

    const delhandlePinMessage = async (msg) => {

        try {
            const results = await delPinMessages(msg.backid);
        } catch (error) {
            console.error('Error sending button click to the backend:', error.message);
        }
    };

    //////////////////////////////////// PLUS 버튼 ///////////////////////////////////////////

    const handlePlusButtonClick = async (e) => {
        e.preventDefault();
        if (!isPlusButtonClicked) {
            const sReco = await getsReco(selectedChatId);
            console.log(sReco)
            setSReco(sReco);
            if(sReco.first==null&&sReco.second==null&&sReco.third==null){
                alert("질문을 입력해 주세요!");
                return
            }
            else{
                setIsPlusButtonClicked(!isPlusButtonClicked);
            }
        } else {
            setSReco(null);
            setIsPlusButtonClicked(!isPlusButtonClicked);
        }
    }

    const handleLeftButtonClick = () => {
        if (sReco.second !== null || sReco.third !== null) {
            setCurrentPage(prevPage => {
                if (prevPage === 1) {
                    return totalPages;
                } else {
                    return prevPage - 1;
                }
            });
        }
    };

    const handleRightButtonClick = () => {
        if (sReco.second !== null || sReco.third !== null) {
            setCurrentPage(prevPage => (prevPage % totalPages) + 1);
        }
    };



    ////////////////////////////////////채팅창 삭제 및 수정/////////////////////////////////////
    const handleChatRoomClick = (e,chat) => {
        e.stopPropagation();
        setEditchatRoom(chat.title)
        setactionId(chat.id)
        setactionTitle(chat.title)
        setModalOpen(true);
    };

   const handleCloseModal = () => {
        setModalOpen(false);
    }

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
                                style={{width: '100%', height: '100%', cursor: 'pointer'}}
                            >
                                <span
                                    className="btninbtn"
                                    onClick={(e) => handleChatRoomClick(e, chat)}
                                >
                                    =
                                </span>

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
                            <button className="foldbtn" style={{width: "100%", height: "100%", border: 'none'}}
                                    onClick={handleFoldButtonClick}>
                                {isFolded ? '펴기' : '접기'}
                            </button>
                        </div>
                        <div ref={middlePanelRef} className="chat-panel"
                             style={{
                                 width: isFolded ? '80%' : '40%',
                                 pointerEvents: isPdfViewerDisabled ? 'none' : 'auto'
                             }}>
                            {showPdfViewer && <PdfViewer pdfUrl={pdfUrl}/>}
                        </div>
                        <div ref={dividerRef} className="divider" onMouseMove={handleMouseMove}
                             onMouseDown={handleMouseDown}></div>
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
                                        {msg.id !== 1 && msg.id !== 2 && msg.sender === "received" && msg.backid != 3 && (
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
                                            if (!messageInputRef.current.value.trim()) {
                                                e.preventDefault();
                                            } else {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }
                                    }}
                                />
                                <button type="submit" className="chat-submit-button"
                                        disabled={isLoading || !messageInputRef.current?.value.trim()}
                                        onClick={handleFormSubmit}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>

                    </Fragment>
                    <EditChatModal isOpen={modalOpen} onClose={handleCloseModal} actionId={actionId} actionTitle={actionTitle} />
                </>
            )}

        </div>
    );
};

export default ChatPage;