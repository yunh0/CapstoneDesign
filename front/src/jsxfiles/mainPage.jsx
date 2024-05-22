import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import MyPage from '../jsxfiles/myPage';
import FindPage from '../jsxfiles/findPage';
import PinPage from '../jsxfiles/pinPage';
import SelectPage from "../jsxfiles/selectPage";
import '../cssfiles/mainPage.css'
import ChatPage from "../jsxfiles/chatPage";
import {postLogoutToken} from "../api/postLogoutToken";

const MainPage = () => {
    //페이지를 이동하는 데 사용 navigate 함수 초기화
    const navigate = useNavigate();
    //로그인 상태
    const [isLogin, setIsLogin] = useState(false);
    //현재 페이지 관리
    const [currentPage, setCurrentPage] = useState('welcome');
    //채팅 목록 관리
    const [chatList, setChatList] = useState([]);

    //로그아웃 요청을 보내는 handleLogout 함수
    const handleLogout = async () => {
        const success = await postLogoutToken();
        if (success) {
            //성공 시 로그인 상태를 false로 설정
            setIsLogin(false);
            //메인 페이지로 이동
            navigate('/');
        }
        //실패 시 에러 메시지를 출력
        else {
            console.error('로그아웃 요청 실패');
        }
    };
    //currentPage 상태를 변경. 이는 페이지 전환을 처리
    const handlePageChange = (pageName) => {
        setCurrentPage(pageName);
    };
    let content;
    //content 변수를 설정하여 currentPage 상태에 따라 다른 컴포넌트를 렌더링
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
        case 'select':
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
            {/*left-panel에 버튼 나열*/}
            <div className="left-panel">
                <button className="home-btn" onClick={() => handlePageChange('welcome')}>
                    <span className="material-symbols-outlined">home</span>
                </button>
                <button className="pinpage-btn" onClick={() => handlePageChange('pinpage')}>
                    <span className="material-symbols-outlined">push_pin</span>
                </button>
                <button className="find-btn" onClick={() => handlePageChange('find')}>
                    <span className="material-symbols-outlined">search</span>
                </button>
                <button className="mypage-btn" onClick={() => handlePageChange('mypage')}>
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
                {/*chat 경로의 링크로 이동*/}
                <Link to="/chat" className="chat-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>chat</span>
                </Link>
                {/*handleLogout 함수를 호출하여 로그아웃을 처리*/}
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
            {/*spare-panel에 클릭된 버튼의 페이지 나타냄*/}
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