import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            <div className="rlogin-panel">
                <h1 className="rlogin-title">Login Page</h1>
                {/*<form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>*/}
                <div className = "google-login">
                    <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인"/>
                </div>
            </div>
        </div>
    );
};

export default RloginPage;