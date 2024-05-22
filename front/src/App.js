import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import StartPage from './jsxfiles/startPage';
import MainPage from './jsxfiles/mainPage';
import PinPage from './jsxfiles/pinPage';
import ChatPage from './jsxfiles/chatPage';
import RloginPage from './jsxfiles/rloginPage';
import SelectPage from './jsxfiles/selectPage';
import { getUserInfo } from './api/getUserInfo';

function App() {
    //isLogin 상태 변수로 로그인 여부 확인
    const [isLogin, setIsLogin] = useState(false);

    //컴포넌트 처음 렌더링 시 initLogin 함수를 호출하여 비동기적으로 사용자 정보 획득
    useEffect(() => {
        const initLogin = async () => {
            const name = await getUserInfo();
            //사용자의 이름이 있으면 isLogin 상태를 true로 설정
            setIsLogin(name);
        };
        initLogin();
    }, []);

    return (
        // 애플리케이션의 라우팅 설정
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                //로그인 상태 전달
                <Route path="/rlogin" element={<RloginPage isLogin={isLogin} setIsLogin={setIsLogin} />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/pinpage" element={<PinPage />} />
                <Route path="/select" element={<SelectPage />} />
            </Routes>
        </Router>
    );
}

export default App;