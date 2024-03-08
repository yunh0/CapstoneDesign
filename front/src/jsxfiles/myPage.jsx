import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { getUserInfo } from '../api/getUserInfo';
import '../cssfiles/myPage.css'; // Ensure this is the correct path to your CSS file

export default function MyPage({ isLogin })  {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
    });

    useEffect(() => {
        if (!isLogin) navigate('/');

        const initUserinfo = async () => {
            const newinfo = await getUserInfo();
            setInfo(newinfo);
        };
        initUserinfo();
    }, [isLogin]);


    return (
        <div className="mypage-wrapper">
            <div className="mypage-header">
                <h1 className="mypage-greeting">HI DA YOUNG</h1>
            </div>
            <div className = "mypage-content">
                <div className="mypage-details">
                    <div className="mypage-info-wrapper">
                        <div className="mypage-info">
                            <p>NAME: {`${info.lastName} ${info.firstName}`}</p>
                            <p>EMAIL: {info.email}</p>
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