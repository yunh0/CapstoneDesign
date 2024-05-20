import React, { useState } from 'react';
import '../cssfiles/findPage.css';
import { postFind } from "../api/findHistory";

const FindPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null); // 아코디언 확장 상태 관리

    const handleSearch = async () => {
        try {
            // Reset the expanded row state before executing a new search
            setExpandedRow(null);
            const response = await postFind(searchTerm);
            setSearchResult(response);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleAccordion = (index) => {
        setExpandedRow(expandedRow === index ? null : index); // 이미 확장된 행을 클릭하면 닫힘
    };

    return (
        <div className="find-container">
            <div>
                <h2>SEARCH</h2>
            </div>
            <div className="find-body">
                <input
                    className="find-input"
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="검색어를 입력하세요"
                />
                <button className="find-button" onClick={handleSearch}>
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>
            {searchResult.length > 0 && (
                <table className="find-table">
                    <thead>
                    <tr>
                        <th className="find-th">검색 결과</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchResult.map((result, index) => (
                        index % 2 === 0 && (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className="find-td">
                                        <div className="find-content-button-wrapper">
                                            <span className="find-content">{result.content}</span>
                                            <button className="find-result-button" onClick={() => toggleAccordion(index)}>
                                                <span className="material-symbols-outlined">expand_circle_down</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRow === index && (
                                    <tr>
                                        <td className="find-td-expanded">
                                            {searchResult[index + 1].content}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    ))}

                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FindPage;
