import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './jsxfiles/startPage';
import LoginPage from './jsxfiles/loginPage';
import SignupPage from './jsxfiles/signupPage';
import axios from "axios";

function App() {
    const [hello, setHello] = useState('');
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowText(true);
        }, 1000);

        setTimeout(() => {
            setShowText(false);
        }, 4000);
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </Router>
    );
}

export default App;
