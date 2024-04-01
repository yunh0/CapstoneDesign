import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './jsxfiles/startPage';
import MainPage from './jsxfiles/mainPage';
import ChatPage from './jsxfiles/chatPage';
import RloginPage from './jsxfiles/rloginPage';
import SelectPage from './jsxfiles/selectPage'; // 경로는 실제 구조에 맞게 조정
import { getUserInfo } from './api/getUserInfo';

function App() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const initLogin = async () => {
            const name = await getUserInfo();
            setIsLogin(!!name);
        };
        initLogin();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/rlogin" element={<RloginPage isLogin={isLogin} setIsLogin={setIsLogin} />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/select" element={<SelectPage />} />
            </Routes>
        </Router>
    );
}

export default App;