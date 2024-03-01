import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../cssfiles/mainPage.css';
import MyPage from './myPage'; // MyPage 컴포넌트 추가

const MainPage = () => {
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태 추가

    const toggleModal = () => {
        setShowModal(!showModal); // 모달 표시 여부 토글
    };

    const handleLogout = () => {
        // 로그아웃 로직 추가
    };

    return (
        <div className="container">
            <div className="left-panel">
                <button onClick={toggleModal}>마이페이지</button> {/* 마이페이지 버튼 추가 */}
                <button onClick={handleLogout}>로그아웃</button> {/* 로그아웃 버튼 추가 */}
            </div>
            <div id="middlePanel" className="panel">
                middle Panel
            </div>
            <div id="divider" className="divider"></div>
            <div id="rightPanel" className="panel">
                Right Panel
            </div>
            {showModal && <MyPage onClose={toggleModal} />} {/* 모달 렌더링 */}
        </div>
    );
};

export default MainPage;
