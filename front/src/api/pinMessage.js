<<<<<<< HEAD
export const pinMessage = async (messageId, content) => {
    console.log(messageId,content);
    // API 호출을 통해 메시지의 ID와 내용을 함께 핀하는 로직 구현
    const response = await fetch('/api/pinMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, content }), // ID와 내용을 함께 전송
    });


    if (response.ok) {
        console.log('Message pinned successfully');
    } else {
        console.error('Failed to pin the message');
=======
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
>>>>>>> origin/JW2
    }
};