export const sendChatRoomClick = async (chatroomId, token) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/chatroom/${chatroomId}/`; // URL 끝에 / 추가

    try {
        let headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            credentials: 'include',
            headers: headers, // 조건부로 설정된 헤더
            body: JSON.stringify({chatroomId })
        });

        if (!response.ok) {
            throw new Error('Failed to send button click to the backend');
        }

        return true; // 성공적으로 요청이 완료된 경우 true 반환
    } catch (error) {
        console.error('Error sending button click to the backend:', error.message);
        return false; // 요청이 실패한 경우 false 반환
    }
};
