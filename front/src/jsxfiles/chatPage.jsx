import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../cssfiles/chatPage.css';
import PdfViewer from '../jsxfiles/pdfViewer';

const ChatPage = () => {
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);
    const dividerRef = useRef(null);
    const middlePanelRef = useRef(null);
    const rightPanelRef = useRef(null);

    const handleLogout = () => {
        // 로그아웃 로직 추가
    };

    const handlePdfViewer = () => {
        setShowPdfViewer(true);
    };

    const handleMouseDown = (e) => {
        setDragging(true);
        setPositionX(e.clientX);
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            const dx = e.clientX - positionX;
            setPositionX(e.clientX);

            const middlePanelWidth = middlePanelRef.current.offsetWidth;
            const rightPanelWidth = rightPanelRef.current.offsetWidth;

            middlePanelRef.current.style.width = `${middlePanelWidth + dx}px`;
            rightPanelRef.current.style.width = `${rightPanelWidth - dx}px`;

            // 숨겨진 요소들을 숨김
            middlePanelRef.current.style.overflow = 'hidden';
            rightPanelRef.current.style.overflow = 'hidden';
        }
    };

    const pdfUrl = `https://www.kwdi.re.kr/flexer/view.jsp?FileDir=/CM005&SystemFileName=CM0009_66_1&ftype=pdf&FileName=%EC%97%AC%EC%84%B1%EC%97%B0%EA%B5%AC%EB%85%BC%EB%AC%B8_89-2_(0107_%ED%95%A9%EB%B3%B8%EC%B5%9C%EC%A2%85).pdf`;

    return (
        <div className="chat-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="chat-left-panel">
                <Link to="/main" className="home-btn">홈</Link>
                <button onClick={handlePdfViewer} style={{width: '98%'}}>보험회사 PDF</button>
                <button onClick={handleLogout} className="logout-btn">로그아웃</button>
            </div>
            <div ref={middlePanelRef} className="chat-panel">
                <div className="chat-middle-content">
                    <span>Middle Panel</span>
                </div>
                {showPdfViewer && <PdfViewer pdfUrl={pdfUrl} style={{ width: '100%', height: '96%' }}/>}
            </div>
            <div ref={dividerRef} className="divider" onMouseDown={handleMouseDown}></div>
            <div ref={rightPanelRef} className="chat-panel">
                Right Panel
            </div>
        </div>
    );
};

export default ChatPage;
