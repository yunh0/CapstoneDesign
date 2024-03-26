const pinMessage = async (messageId) => {
    // API 호출을 통해 메시지를 핀하는 로직 구현
    const response = await fetch('/api/pinMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
    });

    if (response.ok) {
        console.log('Message pinned successfully');
    } else {
        console.error('Failed to pin the message');
    }
};
