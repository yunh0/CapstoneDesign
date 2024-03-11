import React, { useState } from 'react';
import '../cssfiles/pinPage.css';

const PinPage = () => {
    const [activeContract, setActiveContract] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const contracts = {
        A: ['Private equity owns hospitals and has created a health crisis. Nursing shortages have contributed to one of every four unexpected hospital deaths or injuries caused by errors. The private equity firms do not serve patients but profits. They have closed hospitals, especially in rural America, and they cut back on stockpiles of vital medical devices including ventilators and personal protective equipment. In 1975, the US had about 1.5 million hospital beds and a population of about 216 million people. Now, with a population of over 330 million people, we have around 925,000 beds. 56% of Americans have medical debt, even though many have insurance, and 23% owe $10,000 or more.\n' +
        '\n',
            'Emergency room visits and emergency rooms, often run by private equity firms, contributed to medical debt for 44% of Americans. At the same time, the healthcare system – Because of this slash-and-burn assault – Was unprepared to handle the COVID epidemic, seeing 330,000 Americans die during the pandemic because they could not afford to go to a doctor on time. These private equity firms, like an invasive species, are ubiquitous. They have acquired educational institutions, utility companies, and retail chains while bleeding taxpayers hundreds of billions in subsidies made possible by bought-and-paid-for prosecutors, politicians, and regulators.'
            ,
            'They took out the equivalent of what they had put into the company. They received that when they sold the land. So they were free and clear. Everything after that became gravy for them, so they weren’t concerned about the profits; They were already in the money, as they say. But the nursing homes suddenly had to pay exorbitant rents and that meant that something else had to give.\n' +
            '\n' +
            'Ultimately, what ended up happening was an enormous Medicare fraud that was designed to overcharge Medicare for services to these residents, and the stories are absolutely gut-wrenching. There were some whistleblowers who came forward talking about what they were seeing and the DOJ took the case, but then blew the case. But some of the tales that these whistleblowers told about forcing aged, frail, ill residents to go through an incredible rehabilitation that they didn’t need, in order to bill Medicare for these processes, was shocking.'],
        B: ['The bloodletting is only accelerating. Business Insider is eliminating 8% of its workforce. The Los Angeles Times recently laid off 120 journalists, more than 20% of the newsroom after cutting 74 newsroom positions last June. Time magazine has announced impending layoffs, The Washington Post at the end of last year cut 240 jobs, Sports Illustrated has been gutted, and CNN, NPR, Vice Media, Vox Media, NBC News, CNBC, and other organizations have all made huge staff cuts.\n' +
        '\n' +
        'The newspaper chain, Gannett, which owns USA Today and many local papers, has cut hundreds of positions. The latest round of layoffs comes on the heels of the worst job cuts in the journalism sector since 2020 when the COVID crisis saw some 2,700 jobs eliminated. The consumption of news and entertainment by the public in the digital age has turned many of the traditional media platforms into dinosaurs. But as they disappear, so does the core of journalism and reporting, especially investigative reporting. Digital platforms are with a few exceptions, not sustaining repertorial coverage, certainly not on the local level, one of the fundamental pillars of democracy.'
            ,
            'Advertising dollars which once sustained the media industry have migrated to digital platforms where advertisers are able to target, with precision, potential customers. The monopoly that the old media had connecting sellers with buyers is gone. Social media and search giants, such as Google and Meta, snap up media content for free and disseminate it. Media outlets are often owned by private equity firms or billionaires that do not invest in journalism but harvest and hollow out the outlets for short-term profits accelerating the death spiral.\n' +
            '\n' +
            'Journalism at its best makes the powerful accountable, but as media organizations decline and news deserts expand, the press, increasingly anemic, is also coming under attack from political demagogues and sites masquerading as news platforms, fake news, misinformation, salacious rumors, and lies fill the void. Civil society is paying the price. Joining me to discuss the crisis in journalism is Gretchen Morgenson, a senior financial reporter for the NBC News Investigative Unit. She previously worked for the Wall Street Journal and the New York Times where she won a Pulitzer Prize. Her latest book is These Are the Plunderers: How Private Equity Runs and Wrecks America.'],
        C: ['답변 C1'
            , '답변 C2'
            , '답변 C3'
            , '답변 C4'
            , '답변 C5'
            , '답변 C6'],
        D: ['답변 D1'
            , '답변 D2'
            , '답변 D3'
            , '답변 D4'
            , '답변 D5'
            , '답변 D6'
            , '답변 D7']
    };

    const handleClick = (contract) => {
        setActiveContract(contracts[contract]);
    };

    const handleAnswerClick = (answer) => {
        setModalContent(answer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="pin-page">
            <h2 className="pin-page-title">Pinned Answers</h2>
            <div className="contracts">
                {Object.keys(contracts).map((contract) => (
                    <button key={contract} onClick={() => handleClick(contract)} className="contract-button">
                        계약서 {contract}
                    </button>
                ))}
            </div>
            <div className="gallery-view">
                {activeContract && activeContract.map((answer, index) => (
                    <div key={index} className="pinned-answer" onClick={() => handleAnswerClick(answer)}>
                        {answer}
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <p>{modalContent}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PinPage;