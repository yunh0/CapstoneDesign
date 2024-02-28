import React from "react";
import { Link } from 'react-router-dom';
import '../cssfiles/startPage.css';

class StartPage extends React.Component {
    render() {
        return (
            <div className="start-page-container">
                <div className="background-overlay" />
                <div className="project-name">PROJECT<br/>NAME</div>
                <Link to="/login" className="login-button">Log in</Link>
                <Link to="/signup" className="signup-button">Sign up</Link>
                <div className="vertical-line" />
                <div className="footer" />
            </div>
        );
    }
}

export default StartPage;
