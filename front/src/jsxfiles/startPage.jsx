import React from "react";
import { Link } from 'react-router-dom';
import '../cssfiles/startPage.css';

class StartPage extends React.Component {
    render() {
        return (
            <div className="start-page-container">
                <div className="project-name-container">
                    <div className="project-name">Insurance Counseling</div>
                </div>
                <div className="get-started">Get Started</div> {/* "Get Started" 텍스트 추가 */}
                <div className="auth-buttons-container">
                    <Link to ='/rlogin' className="login-button">Log in</Link>
                    <Link to ='/rsignup' className="signup-button">Sign up</Link>
                </div>
            </div>
        );
    }
}

export default StartPage;
