import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { postLoginToken } from "../api/postLoginToken";
import GoogleLogin from "../components/GoogleLogin"; // 구현되어 있어야 합니다.
import '../cssfiles/rloginPage.css'; // CSS 파일 경로 확인

const RloginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);

    const onGoogleSignIn = async (res) => {
        try {
            const { credential } = res;
            const result = await postLoginToken(credential); // setIsLogin 제거
            setIsLogin(result);
            if (result) {
                navigate('/main'); // 로그인 성공 시 메인 페이지로 이동
            }
        } catch (error) {
            console.error("Login failed: ", error);
            // 에러 처리 로직 추가 (예: 사용자에게 알림)
        }
    };

    return (
        <div className="rlogin-container">
                <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 600" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 ease-in-out delay-150"><defs><linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="5%" stop-color="#0693e3"></stop><stop offset="95%" stop-color="#8ed1fc"></stop></linearGradient></defs><path d="M 0,700 L 0,262 C 117.19999999999999,293.8666666666667 234.39999999999998,325.7333333333333 422,293 C 609.6,260.2666666666667 867.5999999999999,162.93333333333334 1049,147 C 1230.4,131.06666666666666 1335.2,196.53333333333333 1440,262 L 1440,700 L 0,700 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1" className="transition-all duration-300 ease-in-out delay-150 path-0"></path></svg>
                <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 780" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 ease-in-out delay-150"><defs><linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="5%" stop-color="#0693e3"></stop><stop offset="95%" stop-color="#8ed1fc"></stop></linearGradient></defs><path d="M 0,700 L 0,262 C 117.19999999999999,293.8666666666667 234.39999999999998,325.7333333333333 422,293 C 609.6,260.2666666666667 867.5999999999999,162.93333333333334 1049,147 C 1230.4,131.06666666666666 1335.2,196.53333333333333 1440,262 L 1440,700 L 0,700 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1" className="transition-all duration-300 ease-in-out delay-150 path-0" transform="rotate(-180 720 350)"> </path></svg>

                <div className="project-name-container">
                    <div className="project-name">Insurance Counseling</div>
                </div>
                <div className = "google-login">
                    <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인"/>
                </div>
        </div>
    );
};

export default RloginPage;