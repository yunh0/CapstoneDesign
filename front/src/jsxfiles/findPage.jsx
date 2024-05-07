import React, { useState } from 'react';
import '../cssfiles/findPage.css';
import { postFind } from "../api/findHistory";

const FindPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);

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
                <button onClick={handleSearch}>확인</button>
            </div>
            {searchResult.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th>결과</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchResult.map((result, index) => (
                        <tr key={index}>
                            <td>{result}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>

    );

};

export default FindPage;
