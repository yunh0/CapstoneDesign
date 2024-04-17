import React, { useEffect } from 'react';

const PdfViewer = ({ pdfUrl }) => {


    return (
        <div className="pdf-viewer-container" style={{height: '100%', display: 'flex', justifyContent: 'center'}}>
            <iframe src={pdfUrl} title="PDF Viewer" style={{width: '100%', height: '100%'}}/>
        </div>
    );
};
export default PdfViewer;
