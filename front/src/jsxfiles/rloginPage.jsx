import React, { useState } from "react";
import LoginPage from "../jsxfiles/loginPage";
import {Link} from "react-router-dom";

const RloginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    return (
        <div className="container">

            <div className="left-panel">
                <Link to="/main" className="home-btn">홈</Link>
                <button className="mypage-btn">마이페이지</button>
                <button className="pinpage-btn">핀페이지</button>
                <button className="find-btn">찾기</button>
                <button className="chat-btn">챗페이지</button>
            </div>
            <div>
            <LoginPage />
          </div>


        </div>
    );
};

export default RloginPage;
