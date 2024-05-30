export const getFileName = async (selectedChatId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/chatroom/file/name/${selectedChatId}`;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${API_URL}${path}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.withCredentials = true; // Adjust according to your auth setup

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText); // 텍스트 데이터 반환
            } else {
                reject(new Error('Failed to fetch insurance info'));
            }
        };

        xhr.onerror = function () {
            reject(new Error('Network error'));
        };

        xhr.send();
    });
}
