export const getsReco = async (chatRoomId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/sreCo/${chatRoomId}`;

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to send message to the backend');
        return response.json();
    } catch (error) {
        console.error('getsReco Error: ', error.message);
        return false;
    }
};
