import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postLoginToken } from "../api/postLoginToken";
import GoogleLogin from "../components/GoogleLogin";
import '../cssfiles/startPage.css';

const StartPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [showGoogleLogin, setShowGoogleLogin] = useState(false);

    const onGoogleSignIn = async (res) => {
        try {
            const { credential } = res;
            const result = await postLoginToken(credential);
            setIsLogin(result);
            if (result) {
                navigate('/main');
            }
        } catch (error) {
            console.error("Login failed: ", error);
        }
    };

    const toggleLoginButton = () => {
        setShowGoogleLogin(true);
    };

    return (
        <div className="start-page-container">
            <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 580" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 ease-in-out delay-150">
                <defs>
                    <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
                        <stop offset="5%" stop-color="#0693e3"></stop>
                        <stop offset="95%" stop-color="#8ed1fc"></stop>
                    </linearGradient>
                </defs>
                <path d="M 0,700 L 0,262 C 117.19999999999999,293.8666666666667 234.39999999999998,325.7333333333333 422,293 C 609.6,260.2666666666667 867.5999999999999,162.93333333333334 1049,147 C 1230.4,131.06666666666666 1335.2,196.53333333333333 1440,262 L 1440,700 L 0,700 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1" className="transition-all duration-300 ease-in-out delay-150 path-0"></path>
            </svg>
            <svg width="100%" height="100%" id="svg" viewBox="0 0 1430 805" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 ease-in-out delay-150"><defs><linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%"><stop offset="5%" stop-color="#0693e3"></stop><stop offset="95%" stop-color="#8ed1fc"></stop></linearGradient></defs><path d="M 0,700 L 0,262 C 117.19999999999999,293.8666666666667 234.39999999999998,325.7333333333333 422,293 C 609.6,260.2666666666667 867.5999999999999,162.93333333333334 1049,147 C 1230.4,131.06666666666666 1335.2,196.53333333333333 1440,262 L 1440,700 L 0,700 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1" className="transition-all duration-300 ease-in-out delay-150 path-0" transform="rotate(-180 720 350)"> </path></svg>
            <div className="project-name-container">
                <div className="project-name">Insurance Counseling</div>
                <div className="auth-buttons-container">
                    {!showGoogleLogin ? (
                        <button className="login-button" onClick={toggleLoginButton}>
                            Log in
                        </button>
                    ) : (
                        <div className="google-login">
                            <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="로그인"/>
                        </div>
                    )}
                </div>
                <div className="get-started">Get Started</div> {/* "Get Started" 텍스트 추가 */}
                <div className="auth-buttons-container">
                    <Link to ='/rlogin' className="login-button">Log in</Link>
                    <Link to ='/rsignup' className="signup-button">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default StartPage;