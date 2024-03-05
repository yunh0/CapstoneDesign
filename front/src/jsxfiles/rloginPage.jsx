import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {postLoginToken} from "../api/postLoginToken";
import Nav from "../components/Nav";
import GoogleLogin from "../components/GoogleLogin";

const RloginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const onGoogleSignIn = async res => {
        const { credential } = res;
        const result = await postLoginToken(credential, setIsLogin);
        setIsLogin(result);
    };

    useEffect(() => {
        if (!isLogin) return;
        navigate('/main');
    }, [isLogin]);


    return (
        <div className="container">

            <div className="left-panel">
                <button>홈</button>
                <button className="mypage-btn">마이페이지</button>
                <button className="pinpage-btn">핀페이지</button>
                <button className="find-btn">찾기</button>
                <button className="chat-btn">챗페이지</button>
            </div>
            <div>
                <h1>Login Page</h1>
                <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인"/>
            </div>


        </div>
    );
};

export default RloginPage;
