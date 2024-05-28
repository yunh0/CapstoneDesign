import React, { useState, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import MyPage from '../jsxfiles/myPage';
import FindPage from '../jsxfiles/findPage';
import PinPage from '../jsxfiles/pinPage';
import SelectPage from "../jsxfiles/selectPage";
import ChatPage from "../jsxfiles/chatPage";
import '../cssfiles/mainPage.css'
import {postLogoutToken} from "../api/postLogoutToken";


const MainPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [currentPage, setCurrentPage] = useState('welcome');
    const [chatList, setChatList] = useState([]);
    const [isScrolledDown, setIsScrolledDown] = useState(false); // 스크롤 상태 관리
    const refs = [useRef(null), useRef(null), useRef(null)];  // Multiple refs for different panels
    const [currentRefIndex, setCurrentRefIndex] = useState(0);  // Current index of the ref array

    const handleLogout = async () => {
        const success = await postLogoutToken();
        if (success) {
            setIsLogin(false);
            navigate('/');
        } else {
            console.error('로그아웃 요청 실패');
        }
    };
    const handlePageChange = (pageName) => {
        setCurrentPage(pageName);
        setCurrentRefIndex(0);  // Reset scroll position when page changes
    };

    const toggleScroll = () => {
        let newIndex = currentRefIndex + 1;
        if (newIndex >= refs.length) {
            newIndex = 0;
        }
        if (refs[newIndex].current) {
            refs[newIndex].current.scrollIntoView({ behavior: 'smooth' });
        }
        setCurrentRefIndex(newIndex);
    };

    let content;
    switch (currentPage) {
        case 'find':
            content = <FindPage />;
            break;
        case 'pinpage':
            content = <PinPage />;
            break;
        case 'mypage':
            content = <MyPage />;
            break;
        case 'select': // 'select' 케이스를 추가합니다
            content = <SelectPage />;
            break;
        case 'chat':
            content = <ChatPage setChatList={setChatList} />;
            break;
        default:
            content = (
                <div className="welcome-message">
                    <p></p>
                </div>
            );
            break;
    }
    return (
        <div className="main-container">
            <div className="left-panel">
                <button className="home-btn" onClick={() => handlePageChange('welcome')}>
                    <span className="material-symbols-outlined">home</span>
                </button>
                <button className="pinpage-btn" onClick={() => handlePageChange('pinpage')}>
                    <span className="material-symbols-outlined">push_pin</span>
                </button>
                <button className="find-btn" onClick={() => handlePageChange('find')}>
                    <span className="material-symbols-outlined">search</span>
                </button>
                <button className="mypage-btn" onClick={() => handlePageChange('mypage')}>
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
                <Link to="/chat" className="chat-btn">
                    <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>chat</span>
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
            <div className="spare-panel" ref={refs[0]}>
                <div className="main-content-container" >
                    <div className="main-content-style">{content}</div>
                </div>
                {currentPage === 'welcome' && (
                    <div >
                        <div className="msgnphone-container">
                            <div className="message-container">
                                <div className="content-container">
                                    INSURANCE COUNSELING
                                </div>
                                <div className="message-introduction">
                                    반갑습니다! 필요한 보험 계약을 찾고 한 곳에서 실시간으로 AI 챗봇과 상담하세요. 계약을 선택하고 AI와 개인 채팅방에서 대화를 시작하여 모든 질문에 답변해 드립니다. 여러분의 질문이 우리의 최우선입니다.
                                    <p>Welcome! Find insurance contracts you need and consult with our AI chatbot in real-time in one place. Select a contract and start a conversation in your personal chat room with AI to address all your questions. Your questions are our top priority.</p>
                                </div>
                                <div className="chat-link-container">
                                    <button onClick={() => handlePageChange('select')} className="chat-link">
                                        SELECT INSURANCE
                                    </button>
                                </div>
                            </div>
                            <div className="phone-container">
                                <div className="screen">
                                    <div className="status-bar">
                                        <span>AI Chatbot</span>
                                    </div>
                                    <div className="screen-messages">
                                        <div className="message-received">안녕하세요! 챗봇입니다</div>
                                        <div className="message-received">왼쪽 하단의 버튼을 눌러 챗봇에 질의하고 싶은 보험을 선택하세요!</div>
                                        <div className="message-received">해당 보험과 관련하여 다른 사용자들이 많이 물어본 질문을 보여드릴게요!</div>
                                        <div className="message-received">질의 과정 중에도 질문 내용에 맞춰 추가적으로 추천해 드릴게요!</div>
                                    </div>
                                    <form className="message-input-container">
                                        <input type="text" className="message-input" placeholder="Type your message..." />
                                        <button className="send-btn"><i className="fas fa-paper-plane"></i></button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="spare-panel-2nd" ref={refs[1]}>
                            <div>
                                <div className= "spare-panel-2nd-container">
                                    <div className="spare-panel-2nd-title">
                                        <p>검증된 AI 챗봇, 무엇이든 물어보험</p>
                                    </div>
                                    <div className="spare-panel-2nd-explanation">
                                        <p>다가가기 어려운 보험, 이제 끝!</p>
                                        <p>이제 똑똑한 챗봇과 편하게 알아보아요</p>
                                    </div>
                                </div>
                                <div className="white-box-container">
                                    <div className = "white-box">
                                        <div className= "box-info">
                                            <div className = "box-title-container">
                                                <p className = "box-title">Faithfulness</p>
                                                <p className = "box-title-kor">충실도</p>
                                            </div>
                                            <div className = "box-percentage">85%</div>
                                        </div>
                                        <div className= "box-explanation">
                                            모델의 응답이 원본 문서의 내용을 얼마나 충실하게 반영하는지를 측정합니다.
                                        </div>
                                    </div>
                                    <div className = "white-box">
                                        <div className= "box-info">
                                            <div className = "box-title-container">
                                                <p className = "box-title">Answer Relevancy</p>
                                                <p className = "box-title-kor">답변 관련성</p>
                                            </div>
                                            <div className = "box-percentage">95%</div>
                                        </div>
                                        <div className= "box-explanation">
                                            모델의 응답이 사용자 질문과 얼마나 관련이 있는지를 측정합니다.
                                        </div>
                                    </div>
                                    <div className = "white-box">
                                        <div className= "box-info">
                                            <div className = "box-title-container">
                                                <p className = "box-title">Context Recall</p>
                                                <p className = "box-title-kor">문맥 회수율</p>
                                            </div>
                                            <div className = "box-percentage">91%</div>
                                        </div>
                                        <div className= "box-explanation">
                                            모델이 응답을 생성하는 데 사용한 문맥이 전체 문서의 문맥과 얼마나 잘 일치하는지를 측정합니다.
                                        </div>
                                    </div>
                                    <div className = "white-box">
                                        <div className= "box-info">
                                            <div className = "box-title-container">
                                                <p className = "box-title">Context Precision</p>
                                                <p className = "box-title-kor">문맥 정확도</p>
                                            </div>
                                            <div className = "box-percentage">74%</div>
                                        </div>
                                    <div className= "box-explanation">
                                            모델이 응답을 생성하는 데 사용한 문맥이 실제로 질문과 얼마나 관련이 있는지를 측정합니다.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="spare-panel-3rd" ref={refs[2]}>
                            <div>
                                <div className="msgnphone-container">
                                    <div className={`phone-container-guide ${currentRefIndex === 2 ? 'slide-animation' : ''}`}>
                                        <div className="screen">
                                            <div className="status-bar">
                                                <span>AI Chatbot</span>
                                            </div>
                                            <div className="screen-messages">
                                                <div className="message-received">안녕하세요! 챗봇입니다</div>
                                                <div className="message-received">사용자들이 많이 검색한 질문 유형은 보험금(이)에요!</div>
                                                <div className="message-received">보험금 유형에서 질문을 추천해 드릴게요!</div>
                                                <div className="message-received"><p>1. 이 보험의 납입료 알려줘</p><p> 2. 계약자가 사망하면 어떻게 돼?</p></div>
                                                <div className="message-sent">건물에서 화재로 부상을 당했는데 손해보상이 될까?</div>
                                                <div className="cancel"><span className="material-symbols-outlined">exclamation</span></div>
                                            </div>
                                            <form className="message-input-container">
                                                <input type="text" className="message-input" placeholder="질문을 입력하세요..." />
                                                <button disabled className="send-btn"><i className="fas fa-paper-plane"></i></button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className={`phone-container-guide ${currentRefIndex === 2 ? 'slide-animation' : ''}`}>
                                        <div className="screen">
                                            <div className="status-bar">
                                                <span>AI Chatbot</span>
                                            </div>
                                            <div className="screen-messages">
                                                <div className="message-received">안녕하세요! 챗봇입니다</div>
                                                <div className="message-received">사용자들이 많이 검색한 질문 유형은 보험금(이)에요!</div>
                                                <div className="message-received">보험금 유형에서 질문을 추천해 드릴게요!</div>
                                                <div className="message-received"><p>1. 이 보험의 납입료 알려줘</p><p> 2. 계약자가 사망하면 어떻게 돼?</p></div>
                                                <div className="message-sent">프로미 주택화재보험에 가입했을 때, 건물에서 화재로 부상을 당한다면 손해보상이 될까?</div>
                                                <div className="check_circle"><span className="material-symbols-outlined">check</span></div>
                                            </div>
                                            <form className="message-input-container">
                                                <input type="text" className="message-input" placeholder="질문을 입력하세요..." />
                                                <button disabled className="send-btn"><i className="fas fa-paper-plane"></i></button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="scroll-down">
                            <button onClick={toggleScroll}>
                            <span className="material-symbols-outlined">
                                {currentRefIndex < refs.length - 1 ? "arrow_downward" : "arrow_upward"}
                            </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};
export default MainPage;