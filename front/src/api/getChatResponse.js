export const getChatResponse = async (question, chatroomId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/chat/response/${chatroomId}`;

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ question }), // 질문을 전송
        });
        if (!response.ok) throw new Error('Failed to get chat response from the backend');

        const responseData = await response.json();
        return { text: responseData.text, messageType: responseData.messageType };
    } catch (error) {
        console.error('getChatResponse Error: ', error.message);
        return false;
    }
};
