//시작 페이지

import React from "react";
import { Link } from 'react-router-dom';
import '../cssfiles/startPage.css';

class StartPage extends React.Component {
    //render 메서드를 통해 컴포넌트가 렌더링될 내용 반환
    render() {
        return (
            <div className="start-page-container">
                <div className="project-name-container">
                    <div className="project-name">Insurance Counseling</div>
                </div>
                <div className="get-started">Get Started</div>
                <div className="auth-buttons-container">
                    {/*Link 컴포넌트를 사용하여 rlogin 경로로 네비게이트할 수 있는 로그인 버튼을 생성*/}
                    <Link to ='/rlogin' className="login-button">Log in</Link>
                    <Link to ='/rsignup' className="signup-button">Sign up</Link>
                </div>
            </div>
        );
    }
}

export default StartPage;