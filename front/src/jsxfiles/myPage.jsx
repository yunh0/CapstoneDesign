import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../api/getUserInfo';
import { getSearchKeyword } from "../api/getSearchKeyword";
import { delKeyword } from "../api/delKeyword";
import '../cssfiles/myPage.css';

export default function MyPage({ isLogin }) {
    const [keywordList, setKeywordList] = useState([]);
    const [info, setInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
    });

    const fetchSearchKeyword = async () => {
        try {
            const keywords = await getSearchKeyword();
            if (keywords && keywords.length > 0) {
                const updatedKeywordsList = keywords.map(keyWord => ({
                    id: keyWord.keyWordId,
                    content: keyWord.keyWord
                }));
                setKeywordList(updatedKeywordsList);
            } else {
                setKeywordList([]); // Ensure it's an empty array when no keywords are present
            }
        } catch (error) {
            console.error('Failed to load search keywords:', error.message);
            setKeywordList([]); // Ensure list is cleared if there's an error
        }
    };

    useEffect(() => {
        console.log('Keyword List Updated:', keywordList);
    }, [keywordList]);


    const handleDeleteKeyword = async (id) => {
        try {
            setKeywordList(currentKeywords => currentKeywords.filter(keyword => keyword.id !== id));
            await delKeyword(id);
            // Update keyword list directly by filtering out the deleted keyword
        } catch (error) {
            console.error('Failed to delete keyword:', error);
        }
    };

    useEffect(() => {
        const initUserInfo = async () => {
            const newInfo = await getUserInfo();
            setInfo(newInfo);
        };
        initUserInfo();
        fetchSearchKeyword(); // Refresh the list after deletion
    }, [isLogin]);

    return (
        <div className="mypage-wrapper">
            <div className="mypage-header">
                <h1 className="mypage-greeting">HI USER!</h1>
            </div>
            <div className="mypage-content">
                <div className="mypage-details">
                    <h2>YOUR INFO</h2>
                    <div className="mypage-info">
                        <p>NAME: {info.firstName}</p>
                        <p>EMAIL: {info.email}</p>
                    </div>
                </div>
                <div className="mypage-search">
                    <h2 className="mypage-search-title">YOUR SEARCH</h2>
                    <div className="mypage-search-box">
                        {keywordList.length > 0 ? (
                            keywordList.slice().reverse().map(keyWord => (
                                <div key={keyWord.id} className="search-keyword">
                                    {keyWord.content}
                                    <button onClick={() => handleDeleteKeyword(keyWord.id)} className="delete-button">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="search-keyword">검색어 목록이 비었습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
