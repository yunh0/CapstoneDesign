export const sendChatRoomClick = async (selectedChatId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/chatroom/${selectedChatId}/`;//selectedChatId에 따라 동적으로 경로 설정

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
        if (!response.ok) {
            throw new Error('Failed to send button click to the backend');
        }
//응답 성공 시 response.json() 반환
        return response.json();
    }
        //오류 처리
    catch (error) {
        console.error('Error sending button click to the backend:', error.message);
        return false; // 요청이 실패한 경우 false 반환
    }
};