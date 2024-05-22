export const getUserInfo = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/oauth/user/info'; //경로 설정

    try {
        const response = await fetch(`${API_URL}${path}`, {
            headers: {
                // HTTP 통신 요청 메서드(디폴트 GET)
                //전송하는 데이터의 형식이 JSON
                'Content-Type': 'application/json',
                //서버로부터 JSON 형식의 응답을 기대
                Accept: 'application/json',
            },
            // 요청에 쿠키를 포함
            credentials: 'include',
        });
        if (!response.ok) throw new Error('bad server condition');
        //응답 성공 시 response.json() 반환
        return response.json();
    }
        //오류 처리
    catch (e) {
        console.error('getUserInfo Error: ', e.message);
        return false;
    }
};