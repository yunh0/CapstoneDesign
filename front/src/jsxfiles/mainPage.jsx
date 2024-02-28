import React, { useState } from 'react';
import '../cssfiles/mainPage.css';

const App = () => {
    const [dragging, setDragging] = useState(false);
    const [positionX, setPositionX] = useState(null);
    const [leftPanelVisible, setleftPanelVisible] = useState(true);

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

    const toggleleftPanel = () => {
        setleftPanelVisible(!leftPanelVisible);
    };

    return (
        <div className="container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className="left-panel" style={{ display: leftPanelVisible ? 'block' : 'none' }}>
                left Panel
            </div>
            <div id="middlePanel" className="panel">
                <button className="toggle-button" onClick={toggleleftPanel}>
                    {leftPanelVisible ? 'Hide' : 'Show'}
                </button>
                middle Panel
            </div>
            <div id="divider" className="divider" onMouseDown={handleMouseDown}></div>
            <div id="rightPanel" className="panel">
                Right Panel
            </div>
        </div>
    );
};

export default App;
