export const getMessages = async (token, chatroomId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/chatroom/${chatroomId}`;

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            credentials: 'include',
        });

        if (!response.ok) throw new Error('bad server condition');

        return await response.json();
    } catch (e) {
        console.error('getUserChatRooms Error: ', e.message);
        return false;
    }
};
