import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import MyPage from '../jsxfiles/myPage';
import FindPage from '../jsxfiles/findPage';
import PinPage from '../jsxfiles/pinPage';
import SelectPage from "../jsxfiles/selectPage";
import '../cssfiles/mainPage.css'
import ChatPage from "../jsxfiles/chatPage";

const Layout = () => {
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
    return (
        <div className="main-container">
            <div className="left-panel">
                <button className="home-btn" onClick={() => handlePageChange('welcome')}>
                    <span className="material-symbols-outlined">home</span>
                </button>
                <Link to="/pinpage" className="pinpage-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>push_pin</span>
                </Link>
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
            <div className="right-panel">
                <Outlet /> {/* 자식 라우트가 렌더링되는 위치 */}
            </div>
        </div>
    );
};

export default Layout;