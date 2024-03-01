import React from 'react';
import ReactDOM from 'react-dom';
import '../cssfiles/myPage.css';

const MyPage = ({ onClose }) => {
    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close-btn" onClick={onClose}>x</button> {/* 닫기 버튼을 'x'로 변경 */}
                <h1>마이페이지</h1>
                {/* 마이페이지 내용 추가 */}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default MyPage;
