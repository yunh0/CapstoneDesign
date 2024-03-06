import React, { useState } from 'react';
import '../cssfiles/newchatModal.css';

const NewChatModal = ({ onClose, setChatList }) => {
    const [title, setTitle] = useState('');
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insuranceTerms, setInsuranceTerms] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleInsuranceTypeChange = (e) => {
        setInsuranceType(e.target.value);
    };

    const handleInsuranceCompanyChange = (e) => {
        setInsuranceCompany(e.target.value);
    };

    const handleInsuranceTermsChange = (e) => {
        setInsuranceTerms(e.target.value);
    };

    const handleSubmit = () => {
        if (title.trim() === '') {
            document.getElementById("newchat-input").setAttribute("placeholder", "!!내용을 입력하세요!!");
        } else {
            const newChat = { title, insuranceType, insuranceCompany, insuranceTerms };
            setChatList(prevChatList => [...prevChatList, newChat]);
            onClose();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="newchat-close" onClick={onClose}>&times;</span>
                <h2>새 채팅 만들기</h2>
                <label htmlFor="newchat-input">제목</label>
                <input id="newchat-input" className="newwchat-input" type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력하세요" />

                <label>보험 종류</label>
                <div>
                    <input type="radio" name="insuranceType" value="자동차" checked={insuranceType === "자동차"} onChange={handleInsuranceTypeChange} />
                    <label>자동차</label>
                    <input type="radio" name="insuranceType" value="암" checked={insuranceType === "암"} onChange={handleInsuranceTypeChange} />
                    <label>암</label>
                    <input type="radio" name="insuranceType" value="실손의료" checked={insuranceType === "실손의료"} onChange={handleInsuranceTypeChange} />
                    <label>실손의료</label>
                    <input type="radio" name="insuranceType" value="화재" checked={insuranceType === "화재"} onChange={handleInsuranceTypeChange} />
                    <label>화재</label>
                    <input type="radio" name="insuranceType" value="연금" checked={insuranceType === "연금"} onChange={handleInsuranceTypeChange} />
                    <label>연금</label>
                </div>

                <label>보험사</label>
                <div>
                    <input type="radio" name="insuranceCompany" value="A" checked={insuranceCompany === "A"} onChange={handleInsuranceCompanyChange} />
                    <label>A</label>
                    <input type="radio" name="insuranceCompany" value="B" checked={insuranceCompany === "B"} onChange={handleInsuranceCompanyChange} />
                    <label>B</label>
                    <input type="radio" name="insuranceCompany" value="C" checked={insuranceCompany === "C"} onChange={handleInsuranceCompanyChange} />
                    <label>C</label>
                </div>

                <label>보험약관</label>
                <div>
                    <input type="radio" name="insuranceTerms" value="가" checked={insuranceTerms === "가"} onChange={handleInsuranceTermsChange} />
                    <label>가</label>
                    <input type="radio" name="insuranceTerms" value="나" checked={insuranceTerms === "나"} onChange={handleInsuranceTermsChange} />
                    <label>나</label>
                    <input type="radio" name="insuranceTerms" value="다" checked={insuranceTerms === "다"} onChange={handleInsuranceTermsChange} />
                    <label>다</label>
                    <input type="radio" name="insuranceTerms" value="라" checked={insuranceTerms === "라"} onChange={handleInsuranceTermsChange} />
                    <label>라</label>
                    <input type="radio" name="insuranceTerms" value="마" checked={insuranceTerms === "마"} onChange={handleInsuranceTermsChange} />
                    <label>마</label>
                </div>

                <button className="newchat-ok" onClick={handleSubmit}>확인</button>
            </div>
        </div>
    );
};

export default NewChatModal;
