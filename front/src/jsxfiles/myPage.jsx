import React, { useEffect, useState } from 'react';
//사용자 정보를 가져오는 함수
import { getUserInfo } from '../api/getUserInfo';
//검색 키워드를 가져오는 함수
import {getSearchKeyword} from "../api/getSearchKeyword";
import '../cssfiles/myPage.css';


//isLogin이라는 prop을 받는 MyPage 컴포넌트 정의
export default function MyPage({ isLogin })  {
    //keywordList와 setKeywordList라는 state를 빈 배열로 초기화합니다.
    const [keywordList, setKeywordList] = useState([]);
    // // info와 setInfo라는 state를 이메일, 이름, 성을 포함하는 객체로 초기화
    const [info, setInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
    });

    //getSearchKeyword를 호출하여 검색 키워드를 가져오는 fetchSearchKeyword라는 비동기 함수 정의
    const fetchSearchKeyword = async () => {
        try {
            const keywords = await getSearchKeyword();
            //검색 키워드가 존재하고 길이가 0보다 큰 경우, 각 키워드를 id와 content를 가진 객체로 변환
            if (keywords && keywords.length > 0) {
                const updatedKeywordsList = keywords.map(keyWord => ({
                    id: keyWord.keyWordId,
                    content: keyWord.keyWord
                }));
                //setKeywordList를 사용해 상태에 저장
                setKeywordList(updatedKeywordsList);
            } else {
                //검색 키워드가 비어 있는 경우, setKeywordList를 사용해 기본 메시지를 상태에 저장하고 콘솔에 메시지를 출력
                setKeywordList([{ id: 1, content: '검색어 목록이 비었습니다.' }]);
                console.log("검색어 목록이 비어있습니다.")
            }
        } catch (error) {
            console.error('검색어 목록을 불러오는 중 오류가 발생했습니다:', error.message);
        }
    };
    //컴포넌트가 처음 렌더링 시 fetchSearchKeyword 함수를 호출
    useEffect(() => {
        fetchSearchKeyword();
    }, []);

//isLogin 값이 변경될 때마다 사용자 정보를 가져오는 initUserinfo 함수를 호출
    useEffect(() => {
        const initUserinfo = async () => {
            //getUserInfo를 호출하여 사용자 정보를 가져오고 setInfo를 사용해 상태에 저장
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
                        {/*keywordList 배열을 역순으로 순회하며 각 키워드 렌더링*/}
                        {keywordList.slice().reverse().map(keyword => (
                          //keyword.id를 key로 설정하고 keyword.content를 표시
                            <div key={keyword.id} className="search-keyword">{keyword.content}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};