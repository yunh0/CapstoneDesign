import React, { useState } from 'react';
import '../cssfiles/mainPage.css';
import MyPage from '../jsxfiles/myPage';
import PdfViewer from '../jsxfiles/pdfViewer';

const MainPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [leftPanelVisible, setLeftPanelVisible] = useState(true);
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleLogout = () => {
        // 로그아웃 로직 추가
    };

    const handlePdfViewer = () => {
        setShowPdfViewer(true);
    };

    const toggleLeftPanel = () => {
        setLeftPanelVisible(!leftPanelVisible);
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

            const middlePanel = document.getElementById('middlePanel');
            const rightPanel = document.getElementById('rightPanel');

            const middlePanelWidth = parseInt(window.getComputedStyle(middlePanel).width, 10);
            const rightPanelWidth = parseInt(window.getComputedStyle(rightPanel).width, 10);

            middlePanel.style.width = `${middlePanelWidth + dx}px`;
            rightPanel.style.width = `${rightPanelWidth - dx}px`;

            // 숨겨진 요소들을 숨김
            middlePanel.style.overflow = 'hidden';
            rightPanel.style.overflow = 'hidden';
        }
    };

    const pdfUrl = `https://www.kwdi.re.kr/flexer/view.jsp?FileDir=/CM005&SystemFileName=CM0009_66_1&ftype=pdf&FileName=%EC%97%AC%EC%84%B1%EC%97%B0%EA%B5%AC%EB%85%BC%EB%AC%B8_89-2_(0107_%ED%95%A9%EB%B3%B8%EC%B5%9C%EC%A2%85).pdf`;

    return (
        <div className="container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="left-panel" style={{display: leftPanelVisible ? 'block' : 'none'}}>
                <button onClick={toggleModal}>마이페이지</button>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={handlePdfViewer} style={{width: '98%'}}>보험회사 PDF</button>
            </div>
            <div id="middlePanel" className="panel">
                <div className="middle-content">
                    <button className="toggle-button" onClick={toggleLeftPanel}>
                        {leftPanelVisible ? 'Hide' : 'Show'}
                    </button>
                    <span>Middle Panel</span>
                </div>
                {showPdfViewer && <PdfViewer pdfUrl={pdfUrl} toggleLeftPanel={toggleLeftPanel}/>}
            </div>
            <div id="divider" className="divider" onMouseDown={handleMouseDown}></div>
            <div id="rightPanel" className="panel">
                Right Panel
            </div>
            {showModal && <MyPage onClose={toggleModal}/>}
        </div>
    );
};

export default MainPage;
