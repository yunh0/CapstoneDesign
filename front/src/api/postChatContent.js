export const postChatContent = async (content) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/user/message';

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to send message to the backend');

        return true;
    } catch (error) {
        console.error('postChatContent Error: ', error.message);
        return false;
    }
};