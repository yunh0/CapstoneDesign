export const postFind = async (content) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/message/search`;

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
        //console.log(response.json())
        return response.json();
    } catch (error) {
        console.error('postFind Error: ', error.message);
        return false;
    }
};