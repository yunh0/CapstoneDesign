import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './jsxfiles/startPage';
import MainPage from './jsxfiles/mainPage';
import ChatPage from './jsxfiles/chatPage';
import RloginPage from './jsxfiles/rloginPage';
import { getUserInfo } from './api/getUserInfo';

import axios from "axios";

function App() {
    const [hello, setHello] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const initLogin = async () => {
            const name = await getUserInfo();
            setIsLogin(!!name);
        };
        initLogin();
    }, []);

    /*
        useEffect(() => {
            axios.get('/api/test')
                .then((res) => {
                    setHello(res.data);
                })
        }, []);
    */
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/rlogin" element={<RloginPage isLogin={isLogin} setIsLogin={setIsLogin}/>} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
    );
}

export default App;
