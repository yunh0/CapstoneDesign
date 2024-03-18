export const sendChatRoomClick = async (selectedChatId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/chatroom/${selectedChatId}/`; // URL 끝에 / 추가

    try {
        const response = await fetch(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to send button click to the backend');
        }

        return response.json();
    } catch (error) {
        console.error('Error sending button click to the backend:', error.message);
        return false; // 요청이 실패한 경우 false 반환
    }
};