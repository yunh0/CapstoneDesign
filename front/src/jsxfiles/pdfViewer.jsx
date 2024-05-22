//pdf viewer

import React from 'react';

// pdfUrl이라는 props를 받는 PdfViewer라는 함수형 컴포넌트를 정의
const PdfViewer = ({ pdfUrl }) => {
    return (
        <div className="pdf-viewer-container" style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
            {/*iframe 요소를 사용하여 PDF 파일을 표시, src 속성에 pdfUrl을 지정*/}
            <iframe src={pdfUrl} title="PDF Viewer" style={{ width: '100%', height: '100%'}} />
        </div>
    );
};

export default PdfViewer;
