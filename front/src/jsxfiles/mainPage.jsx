// MainPage.jsx
import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import MyPage from '../jsxfiles/myPage';
import FindPage from '../jsxfiles/findPage';
import PinPage from '../jsxfiles/pinPage';
import '../cssfiles/mainPage.css'

const MainPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [currentPage, setCurrentPage] = useState('welcome');

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
        default:
            content = (
                <div className="welcome-message">
                    <p>WELCOME</p>
                    <p>TO</p>
                    <p>INSURANCE</p>
                    <p>COUNSELING</p>
                </div>
            );
            break;
    }

    return (
        <div className="main-container">
            <div className="left-panel">
                <button className="home-btn" onClick={() => handlePageChange('welcome')}></button>
                <button className="pinpage-btn" onClick={() => handlePageChange('pinpage')}></button>
                <button className="find-btn" onClick={() => handlePageChange('find')}></button>
                <button className="mypage-btn" onClick={() => handlePageChange('mypage')}></button>
                <Link to="/chat" className="chat-btn"></Link>

                <button onClick={handleLogout} className="logout-btn"></button>
            </div>
            <div className="spare-panel">
                <div className="main-content-container">
                    <div className="main-content-style">{content}</div>
                </div>
                {currentPage === 'welcome' && <Link to="/chat" className="chat-link">SELECT INSURANCE</Link>}
            </div>
        </div>
    );
};

export default MainPage;