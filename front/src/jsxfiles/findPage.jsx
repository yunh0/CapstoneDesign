import React, { useState } from 'react';
import '../cssfiles/findPage.css';
import { postFind } from "../api/findHistory";

const FindPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [modalContent, setModalContent] = useState('');

    const handleSearch = async () => {
        try {
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

    const handleModalOpen = (content) => {
        setModalContent(content);
    };

    const handleModalClose = () => {
        setModalContent('');
    };

    return (
        <div className="findpage-container">
            <div>
                <h2>SEARCH</h2>
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
                <button className="findpage-button" onClick={handleSearch}>
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>
            {searchResult.length > 0 && (
                <table className="findtable">
                    <thead>
                    <tr>
                        <th className="findth">검색 결과</th>
                    </tr>
                    </thead>
                    <tbody>
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
