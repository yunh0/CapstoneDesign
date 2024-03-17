export const sendChatRoomClick = async (message, chatroomId, token) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/message/${chatroomId}`;

    try {
        const response = await fetch('${API_URL}${path}', {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 토큰이 필요한 경우에만 추가
            },
            body: JSON.stringify({ message, chatroomId })
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
