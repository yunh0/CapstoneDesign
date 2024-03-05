// MainPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MyPage from '../jsxfiles/myPage';
import FindPage from '../jsxfiles/findPage';
import PinPage from '../jsxfiles/pinPage';
import '../cssfiles/mainPage.css'

const MainPage = () => {
    const [currentPage, setCurrentPage] = useState('welcome');

    const handleLogout = () => {
        // 로그아웃 로직 추가
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
        default:
            content = 'WELCOME!';
            break;
    }

    return (
        <div className="container">
            <div className="left-panel">
                <button className="home-btn" onClick={() => handlePageChange('welcome')}>홈</button>
                <button className="pinpage-btn" onClick={() => handlePageChange('pinpage')}>핀페이지</button>
                <button className="find-btn" onClick={() => handlePageChange('find')}>찾기</button>
                <button className="mypage-btn" onClick={() => handlePageChange('mypage')}>마이페이지</button>
                <Link to="/chat" className="chat-btn">챗페이지</Link>
                <button onClick={handleLogout} className="logout-btn">로그아웃</button>
            </div>
            <div className="spare-panel">
                {content}
                {currentPage === 'welcome' && <Link to="/chat">챗페이지</Link>}
            </div>
        </div>
    );
};

export default MainPage;
