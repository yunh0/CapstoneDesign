import React, { useState } from 'react';
import '../cssfiles/mainPage.css';

const App = () => {
    const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
    const [middlePanelWidth, setMiddlePanelWidth] = useState('40%');

    const toggleLeftPanel = () => {
        setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
        if (isLeftPanelCollapsed) {
            setMiddlePanelWidth('40%');
        } else {
            setMiddlePanelWidth('60%');
        }
    };

    return (
        <div className="container">
            <div className={`left-panel ${isLeftPanelCollapsed ? 'collapsed' : ''}`}>
                Left Panel Content
            </div>
            <div className="middle-panel" style={{ width: middlePanelWidth }}>
                <div className="toggle-button" onClick={toggleLeftPanel}></div>
                <div style={{ marginLeft: '10px' }}>Middle Panel Content</div>
            </div>
            <div className="right-panel">
                Right Panel Content
            </div>
        </div>
    );
};

export default App;
