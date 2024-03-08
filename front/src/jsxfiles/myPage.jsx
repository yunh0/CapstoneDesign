import React from 'react';
import '../cssfiles/myPage.css'; // Ensure this is the correct path to your CSS file

const MyPage = () => {
    return (
        <div className="mypage-wrapper">
            <div className="mypage-header">
                <h1 className="mypage-greeting">HI DA YOUNG</h1>
            </div>
            <div className = "mypage-content">
                <div className="mypage-details">
                    <div className="mypage-info-wrapper">
                        <div className="mypage-info">
                            <p>NAME: LEE DA YOUNG</p>
                            <p>EMAIL: dayung5520@gmail.com</p>
                        </div>
                        <div className="mypage-update-btn-wrapper">
                            <button className="mypage-update-btn">UPDATE ACCOUNT</button>
                        </div>
                    </div>
                </div>

                <div className="mypage-search">
                    <h2 className="mypage-search-title">YOUR SEARCH</h2>
                    <div className="mypage-search-box"></div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
