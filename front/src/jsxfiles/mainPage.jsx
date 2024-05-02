import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import MyPage from '../jsxfiles/myPage';
import FindPage from '../jsxfiles/findPage';
import PinPage from '../jsxfiles/pinPage';
import SelectPage from "../jsxfiles/selectPage";
import '../cssfiles/mainPage.css'
import ChatPage from "../jsxfiles/chatPage";
const MainPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [currentPage, setCurrentPage] = useState('welcome');
    const [chatList, setChatList] = useState([]);
    const handleLogout = () => {
        setIsLogin(false);
        navigate('/rlogin');
    };
    const handlePageChange = (pageName) => {
        setCurrentPage(pageName);
    };
    let content;
    switch (currentPage) {
        case 'find':
            content = <FindPage />;
            break;
        case 'pinpage':
            content = <PinPage />;
            break;
        case 'mypage':
            content = <MyPage />;
            break;
        case 'select': // 'select' 케이스를 추가합니다
            content = <SelectPage />;
            break;
        case 'chat':
            content = <ChatPage setChatList={setChatList} />;
            break;
        default:
            content = (
                <div className="welcome-message">
                    <p></p>
                </div>
            );
            break;
    }
    return (
        <div className="main-container">
            <div className="left-panel">
                <button className="home-btn" onClick={() => handlePageChange('welcome')}>
                    <span className="material-symbols-outlined">home</span>
                </button>
                {/*<Link to="/pinpage" className="pinpage-btn">*/}
                {/*    <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>push_pin</span>*/}
                {/*</Link>*/}
                <button className="pinpage-btn" onClick={() => handlePageChange('pinpage')}>
                    <span className="material-symbols-outlined">push_pin</span>
                </button>
                <button className="find-btn" onClick={() => handlePageChange('find')}>
                    <span className="material-symbols-outlined">search</span>
                </button>
                <button className="mypage-btn" onClick={() => handlePageChange('mypage')}>
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
                <Link to="/chat" className="chat-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>chat</span>
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
            <div className="spare-panel">
                <div className="main-content-container">
                    <div className="main-content-style">{content}</div>
                </div>
                {currentPage === 'welcome' && (
                    <div>
                        <div className="content-container">
                            INSURANCE COUNSELING
                        </div>
                        <div className="message-container">
                            <div className="phone-container">
                                <div className="screen">
                                    <div className="status-bar">
                                        {/*<span>9:41 AM</span>*/}
                                        {/*<span>98%</span>*/}
                                        <span>AI Chatbot</span>
                                    </div>
                                    <div className="screen-messages">
                                        <div className="message sent">Hello!</div>
                                        <div className="message received">Hi, how can I help you?</div>
                                    </div>
                                    <form className="message-input-container">
                                        <input type="text" className="message-input" placeholder="Type your message..." />
                                        <button className="send-btn">Send</button>
                                    </form>
                                </div>
                            </div>
                            <div className="content-message">
                                {/*<p>환영합니다! 당신이 원하는 모든 보험 정보를 한곳에서 확인하고, AI 챗봇을 통해 실시간으로 상담 받을 수 있는 곳입니다. 우리 사이트는 사용자가 보험 계약을 이해하고, 최적의 선택을 할 수 있도록 설계되었습니다.*/}
                                {/*</p>*/}
                                {/*<p>문서를 선택하면, 즉시 개설되는 채팅방에서 AI와 대화하며 궁금한 점을 해결해 보세요. 또한, 중요한 답변은 핀하여 나중에 쉽게 찾아볼 수 있습니다. 우리는 사용자의 보험 경험을 더 편리하고 효율적으로 만들기 위해 끊임없이 노력합니다.*/}
                                {/*</p>*/}
                                {/*<p>지금 바로 시작하여 보다 명확하고 편안한 보험 상담의 경험을 제공받으세요. 여기서는 당신의 질문이 가장 중요합니다.*/}
                                {/*</p>*/}
                                <p>Welcome! Find all the insurance information you need in one place and consult with our AI chatbot in real-time. Our website is designed to help you understand insurance policies and make the best choices possible.
                                </p>
                                <p>Select a document and start a conversation in your personal chat room with AI to address all your questions. Use the pin feature to easily refer to important answers later.
                                </p>
                                <p>Start now to enjoy a clearer and more comfortable insurance consulting experience. Your questions are our top priority.
                                </p>
                                <div className="chat-link-container">
                                    <button onClick={() => handlePageChange('select')} className="chat-link">
                                        SELECT INSURANCE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};
export default MainPage;