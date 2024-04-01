import React from 'react';

const PdfViewer = ({ pdfUrl }) => {
    return (
        <div className="pdf-viewer-container" style={{ height: '96%', display: 'flex', justifyContent: 'center' }}>
            <iframe src={pdfUrl} title="PDF Viewer" style={{ width: '95%', height: '100%' }} onMouseMove={handleIframeMouseMove} />
        </div>
    );
};

export default PdfViewer;
