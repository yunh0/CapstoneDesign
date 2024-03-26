// PdfViewer.js
import React from 'react';

const PdfViewer = ({ pdfUrl }) => {
    return (
        <div className="pdf-viewer-container" style={{height: '96%'}}>
            <iframe src={pdfUrl} title="PDF Viewer" style={{width: '100%', height: '100%'}}/>
        </div>
    );
};

export default PdfViewer;