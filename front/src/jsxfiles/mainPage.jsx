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
        navigate('/');
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
                        <div className="select-lang">
                            Eng | Kor
                        </div>
                        <div className="msgnphone-container">
                            <div className="message-container">
                                <div className="content-container">
                                    INSURANCE COUNSELING
                                </div>
                                <div className="message-introduction">
                                    Welcome! Find insurance contracts you need and consult with our AI chatbot in real-time in one place. Select a contract and start a conversation in your personal chat room with AI to address all your questions. Your questions are our top priority.                                </div>
                                <div className="chat-link-container">
                                    <button onClick={() => handlePageChange('select')} className="chat-link">
                                        SELECT INSURANCE
                                    </button>
                                </div>
                            </div>
                            <div className="phone-container">
                                <div className="screen">
                                    <div className="status-bar">
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
                        </div>

                    </div>

                )}
            </div>
        </div>
    );
};
export default MainPage;