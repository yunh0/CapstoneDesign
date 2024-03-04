// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import StartPage from './jsxfiles/startPage';
// import LoginPage from './jsxfiles/loginPage';
// import SignupPage from './jsxfiles/signupPage';
// import axios from "axios";
//
// function App() {
//     const [hello, setHello] = useState('');
//     const [showText, setShowText] = useState(false);
//
//     useEffect(() => {
//         setTimeout(() => {
//             setShowText(true);
//         }, 1000);
//
//         setTimeout(() => {
//             setShowText(false);
//         }, 4000);
//     }, []);
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<StartPage />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/signup" element={<SignupPage />} />
//             </Routes>
//         </Router>
//     );
// }
//
// export default App;

import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from './api/getUserInfo';

export default function App() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const initLogin = async () => {
            const name = await getUserInfo();
            setIsLogin(!!name);
        };
        initLogin();
    }, []);

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />}
                />
                <Route
                    path="mypage"
                    element={isLogin ? <MyPage isLogin={isLogin} /> : <Navigate to="/" />}
                />
            </Routes>
        </div>
    );
}
