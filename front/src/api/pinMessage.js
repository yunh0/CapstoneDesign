export const postPinMessage = async (messageId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/savePin/${messageId}`;

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
        console.error('pinMessage Error: ', error.message);
        return false;
    }
};