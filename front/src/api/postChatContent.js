export const postChatContent = async (content, chatroomId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/message/${chatroomId}`;

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
    if(chatroomId){
        console.log(chatroomId);
    }
        console.log("읍다");
        return true;
    } catch (error) {
        console.error('postChatContent Error: ', error.message);
        return false;
    }
};