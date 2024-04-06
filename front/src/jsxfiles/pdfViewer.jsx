import React from 'react';

const PdfViewer = ({ pdfUrl, onMouseMove }) => {
    const handleIframeMouseMove = (e) => {
        onMouseMove(e);
    };

    return (
        <div className="pdf-viewer-container" style={{height: '96%', display: 'flex', justifyContent: 'center'}}>
            <iframe src={pdfUrl} title="PDF Viewer" style={{width: '100%', height: '100%'}} key={pdfUrl}/>
        </div>
    );
};

export default PdfViewer;
