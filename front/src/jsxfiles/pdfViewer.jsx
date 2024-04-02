// PdfViewer.js
import React from 'react';

const PdfViewer = ({ pdfUrl }) => {
    console.log("In pdfViewer: ",pdfUrl);
    return (
        <div className="pdf-viewer-container" style={{height: '96%'}}>
            <iframe src={pdfUrl} title="PDF Viewer" style={{width: '100%', height: '100%'}} key={pdfUrl}/>
        </div>
    );
};

export default PdfViewer;