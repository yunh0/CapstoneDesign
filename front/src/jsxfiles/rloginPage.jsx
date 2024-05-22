import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLoginToken } from "../api/postLoginToken";
//Google 로그인을 처리하는 Google 로그인 컴포넌트를 가져옴
import GoogleLogin from "../components/GoogleLogin";
import '../cssfiles/rloginPage.css';

const RloginPage = () => {
    //페이지를 이동하는 데 사용하는 navigate 함수를 초기화
    const navigate = useNavigate();
    //사용자가 로그인했는지 여부를 나타내는 상태변수 초기화
    const [isLogin, setIsLogin] = useState(false);

    // Google 로그인 성공 시 호출되며, 로그인 토큰을 서버에 전송
    const onGoogleSignIn = async (res) => {
        try {
            const { credential } = res;
            const result = await postLoginToken(credential);
            setIsLogin(result);
            if (result) {
                navigate('/main'); // 로그인 성공 시 메인 페이지로 이동
            }
        }
        //에러 발생 시 콘솔에 에러 메시지를 출력
        catch (error) {
            console.error("Login failed: ", error);
        }
    };

    return (
        <div className="rlogin-container">
            <div className="rlogin-panel">
                <h1 className="rlogin-title">Login Page</h1>
                <div className = "google-login">
                    {/*onGoogleSignIn 함수를 props로 받는 GoogleLogin 컴포넌트*/}
                    <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인"/>
                </div>
            </div>
        </div>
    );
};

export default RloginPage;