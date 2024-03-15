import axios from 'axios';
export const getUserChatRooms = async (token) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/user/chatrooms';

    try {
        const response = await axios.get(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('bad server condition');
        return response.data;
    } catch (e) {
        console.error('getUserChatRooms Error: ', e.message);
        return false;
    }
};
