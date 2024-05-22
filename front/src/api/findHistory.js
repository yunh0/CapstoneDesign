export const postFind = async (content) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/message/search`; //경로 설정

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
            body: JSON.stringify({ content }),//본문에 content 데이터 삽입(body의 데이터 유형 "Content-Type" 헤더와 일치)
        });
        if (!response.ok) throw new Error('Failed to send message to the backend');
        //응답 성공 시 response.json() 반환
        return response.json();
    }
        //오류 처리
    catch (error) {
        console.error('postFind Error: ', error.message);
        return false;
    }
};