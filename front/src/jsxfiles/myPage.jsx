import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../api/getUserInfo';
import {getSearchKeyword} from "../api/getSearchKeyword";
import '../cssfiles/myPage.css';



export default function MyPage({ isLogin })  {
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
                setKeywordList([{ id: 1, content: '검색어 목록이 비었습니다.' }]);
                console.log("검색어 목록이 비어있습니다.")
            }
        } catch (error) {
            console.error('검색어 목록을 불러오는 중 오류가 발생했습니다:', error.message);
        }
    };
    useEffect(() => {
        fetchSearchKeyword();
    }, []);


    useEffect(() => {

        const initUserinfo = async () => {
            const newinfo = await getUserInfo();
            setInfo(newinfo);
        };
        initUserinfo();
    }, [isLogin]);


    return (
        <div className="mypage-wrapper">
            <div className="mypage-header">
                <h1 className="mypage-greeting">HI USER!</h1>
            </div>
            <div className="mypage-content">
                <div className="mypage-details">
                    <div className="mypage-info-wrapper">
                        <div className="mypage-info">
                            <p>NAME: {`${info.firstName}`}</p>
                            <p>EMAIL: {info.email}</p>
                        </div>
                    </div>
                </div>

                <div className="mypage-search">
                    <h2 className="mypage-search-title">YOUR SEARCH</h2>
                    <div className="mypage-search-box">
                        {keywordList.slice().reverse().map(keyword => (
                            <div key={keyword.id} className="search-keyword">{keyword.content}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};