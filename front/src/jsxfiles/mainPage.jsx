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
    const [isScrolledDown, setIsScrolledDown] = useState(false);
    const refs = [useRef(null), useRef(null), useRef(null)];  // 각 패널에 쓰일 refs
    const [currentRefIndex, setCurrentRefIndex] = useState(0);

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
        setCurrentRefIndex(0);
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
        case 'select':
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
                                    어서 오세요! 필요한 보험을 찾아 실시간으로 AI 챗봇에게 궁금한 조항에 대해 물어보세요. 원하는 계약을 선택하고 채팅방에서 AI 챗봇과 보험 약관을 한 눈에 보면서 대화를 시작하세요! 당신의 모든 질문에 답변해 드립니다.
                                    <p>Welcome! Find insurance contracts you need and consult with our AI chatbot in real-time in one place. Select a contract you want and start a conversation in your personal chat room with AI chatbot to address all your questions.</p>
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
                            <div className ="spare-panel-2nd-container">
                                    <div className= {`spare-panel-2nd-info ${currentRefIndex === 1 ? 'slide-animation' : ''}`}>
                                    <div className="spare-panel-2nd-title">
                                        <p>검증된 AI 챗봇, 무엇이든 물어보험</p>
                                    </div>
                                    <div className="spare-panel-2nd-intro">
                                        <p>다가가기 어려운 보험, 이제 끝!</p>
                                        <p>이제 똑똑한 챗봇과 편하게 알아보아요</p>
                                    </div>
                                </div>

                                <div className= {`white-box-container ${currentRefIndex === 1 ? 'slide-animation-3s' : ''}`}>
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
                                <div className = "spare-panel-2nd-explanation">
                                    * RAGAS 평가 기준, github에서 자세한 성능 평가 확인 가능
                                </div>
                            </div>
                        </div>

                        <div className="spare-panel-3rd" ref={refs[2]}>
                            <div className="spare-panel-3rd-container">
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
                                    <div className = "phone-chat-guide">
                                        <div className = "chat-tip">TIP</div>
                                        <div>만약, 챗봇의 대답이 너무 일반적이라면</div>
                                        <div>왼쪽의 예시처럼 질문하는 것보다</div>
                                        <div>오른쪽의 예시처럼 <strong>보험 이름</strong>이나 </div>
                                        <div><strong>"이 보험에서"</strong> 라고 한 번 더 언급해 주세요! </div>
                                        <div>그럼 더 정확한 답변을 받을 수 있을 거예요! </div>
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