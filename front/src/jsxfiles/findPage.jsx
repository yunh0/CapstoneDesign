import React, { useState } from 'react';
import '../cssfiles/findPage.css';
import { postFind } from "../api/findHistory";

const FindPage = () => {
    //검색어를 저장
    const [searchTerm, setSearchTerm] = useState('');
    //검색 결과를 저장
    const [searchResult, setSearchResult] = useState([]);
    //모달에 표시할 내용을 저장
    const [modalContent, setModalContent] = useState('');

    //검색 작업 처리 함수
    const handleSearch = async () => {
        try {
            const response = await postFind(searchTerm);
            setSearchResult(response);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    //searchTerm 상태 업데이트 함수
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    //Enter 키를 누를 때 검색을 트리거
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    //전달된 내용을 modalContent 상태에 설정
    const handleModalOpen = (content) => {
        setModalContent(content);
    };

    //modalContent 상태를 비워서 모달 닫기
    const handleModalClose = () => {
        setModalContent('');
    };

    return (
        <div className="findpage-container">
            <div>
                <h2>찾기 페이지</h2>
            </div>

            <div className="findpage-body">
                <input
                    className="findinput"
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="검색어를 입력하세요"
                />
                <button className="findbutton" onClick={handleSearch}>확인</button>
            </div>
            {/*earchResult에 항목이 있으면 검색 결과를 표시하는 테이블을 렌더링*/}
            {searchResult.length > 0 && (
                <table className="findtable">
                    <thead>
                    <tr>
                        <th className="findth">검색 결과</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*각 결과는 버튼이 있는 행으로 렌더링. 버튼은 짝수 인덱스 항목(질문)의 내용을 표시하며, 클릭 시 다음 항목의 내용(답변)을 모달에 설정*/}
                    {searchResult.map((result, index) => (
                        index % 2 === 0 && (
                            <tr key={index}>
                                <td className="findtd">
                                    <button className="fresultbutton" onClick={() => handleModalOpen(searchResult[index + 1].content)}>
                                        {result.content}
                                    </button>
                                </td>
                            </tr>
                        )
                    ))}
                    </tbody>
                </table>
            )}
            {/*닫기 버튼*/}
            {modalContent && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleModalClose}>&times;</span>
                        <p>{modalContent}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindPage;