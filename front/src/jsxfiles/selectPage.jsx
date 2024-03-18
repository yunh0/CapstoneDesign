import React, { useState } from 'react';
import '../cssfiles/selectPage.css';

const fileTable = [
    { id: 1, type: '암 보험', company: 'KB손해보험', plan: '보험 A', path: '/path/to/암보험-KB손해보험-A.pdf' },
    { id: 2, type: '화재 보험', company: '현대해상', plan: '보험 B', path: '/path/to/화재보험-현대해상-B.pdf' },
    // 추가 데이터...
];

const SelectPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [insuranceType, setInsuranceType] = useState('');
    const [insuranceCompany, setInsuranceCompany] = useState('');
    const [insurancePlan, setInsurancePlan] = useState('');
    const [confirmationStep, setConfirmationStep] = useState(false);
    const [selectedPath, setSelectedPath] = useState('');

    const goToNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const selectType = (type) => {
        setInsuranceType(type);
        goToNextStep();
    };

    const selectCompany = (company) => {
        setInsuranceCompany(company);
        goToNextStep();
    };

    const selectPlan = (plan) => {
        setInsurancePlan(plan);
        goToNextStep();
        setConfirmationStep(true); // 사용자가 계획을 선택하면 확인 단계로 넘어갑니다.
    };
    const modifySelection = () => {
        // 선택 수정을 위해 단계를 리셋합니다.
        setCurrentStep(1);
        setConfirmationStep(false);
    };
    const handleFinalSelection = () => {
        const selectedContract = fileTable.find(contract =>
            contract.type === insuranceType && contract.company === insuranceCompany && contract.plan === insurancePlan);

        if (selectedContract) {
            setSelectedPath(selectedContract.path);
            alert(`선택된 보험: ${insuranceType}, 보험사: ${insuranceCompany}, 보험: ${insurancePlan}\n파일 아이디: ${selectedContract.id}, 파일 경로: ${selectedContract.path}`);
        } else {
            alert('해당하는 계약서를 찾을 수 없습니다.');
        }
    };

    return (
        <div className="select-container">
            {currentStep === 1 && (
                <div className="step-container">
                    <h2>INSURANCE TYPE</h2>
                    <p>선택하고 싶은 계약의 종류를 선택하세요.</p>
                    <div className = "step-buttons">
                        <button onClick={() => selectType('암 보험')}>암 보험</button>
                        <button onClick={() => selectType('화재 보험')}>화재 보험</button>
                        <button onClick={() => selectType('연금 보험')}>연금 보험</button>
                        <button onClick={() => selectType('실비 보험')}>실비 보험</button>
                        <button onClick={() => selectType('자동차 보험')}>자동차 보험</button>

                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className="step-container">
                    <h2>INSURANCE COMPANY</h2>
                    <p>선택한 {insuranceType}의 보험사를 선택하세요.</p>
                    <div className="step-buttons">
                        <button onClick={() => selectCompany('KB손해보험')}>KB손해보험</button>
                        <button onClick={() => selectCompany('현대해상')}>현대해상</button>
                        <button onClick={() => selectCompany('라이나생명')}>라이나생명</button>
                    </div>
                    <button onClick={() => setCurrentStep(currentStep - 1)} className="back-button">
                        <i className="fas fa-arrow-left"></i> {/* Font Awesome 아이콘 */}
                    </button>
                </div>
            )}
            {currentStep === 3 && (
                <div className="step-container">
                    <h2>INSURANCE</h2>
                    <p>선택한 {insuranceCompany}의 보험 중에서 {insuranceType}을 선택하세요.</p>
                    <div className="step-buttons">
                        <button onClick={() => selectPlan('보험 A')}>보험 A</button>
                        <button onClick={() => selectPlan('보험 B')}>보험 B</button>
                        <button onClick={() => selectPlan('보험 C')}>보험 C</button>
                    </div>
                    <div>
                        <button onClick={() => setCurrentStep(currentStep - 1)} className="back-button">
                            <i className="fas fa-arrow-left"></i> {/* Font Awesome 아이콘 */}
                        </button>
                    </div>
                </div>
            )}
            {confirmationStep && (
                <div className="confirmation-container">
                    <h2>SELECTED INSURANCE</h2>
                    <div className="confirmation-summary">
                        <p>보험 종류: <strong>{insuranceType}</strong></p>
                        <p>보험사: <strong>{insuranceCompany}</strong></p>
                        <p>보험: <strong>{insurancePlan}</strong></p>
                        <p>선택하신 보험이 맞습니까?</p>
                    </div>
                    <div className="confirmation-buttons">
                        <button onClick={modifySelection} className="no-button">NO</button>
                        <button onClick={handleFinalSelection} className="yes-button">YES</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectPage;
