export const postInsuranceTerms = async (newChat) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/insurance/terms'; //경로 설정

    try {
        const response = await fetch(`${API_URL}${path}`, {
            // HTTP 통신 요청 메서드
            method: 'POST',
            // 요청에 쿠키를 포함
            credentials: 'include',
            headers: {
                //서버로부터 JSON 형식의 응답을 기대
                Accept: 'application/json',
                //전송하는 데이터의 형식이 JSON
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( newChat ), //본문에 newChat 데이터 삽입(body의 데이터 유형 "Content-Type" 헤더와 일치)
        });
        if (!response.ok) throw new Error('bad server condition');
        //응답 성공 시 true 반환
        return true;
    }
        //오류 처리
    catch (e) {
        console.error('postInsuranceTerms Error: ', e.message);
        return false;
    }
};