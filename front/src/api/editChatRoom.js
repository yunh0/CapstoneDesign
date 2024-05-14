export const editChatRoom = async (chatroomId, newChatRoomName) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/chatroom/${chatroomId}`;

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newChatRoomName }),
        });
        if (!response.ok) throw new Error('Failed to send message to the backend');
        return response.json();
    } catch (error) {
        console.error('editChatRoom Error: ', error.message);
        return false;
    }
};
