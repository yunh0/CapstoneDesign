export const postLogoutToken = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/oauth/logout'; // 로그아웃을 요청하는 API 경로

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
        });
        if (!response.ok) throw new Error('Bad server condition');
        console.log("로그아웃 로직이 불려졌습니다.")
        //응답 성공 시 true 반환
        return true;
    }
        //오류 처리
    catch (e) {
        console.error('postLogoutToken Error: ', e.message);
        return false;
    }
};
