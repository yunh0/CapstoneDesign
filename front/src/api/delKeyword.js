export const delKeyword = async (keyWordId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/user/info/search/delete/${keyWordId}`;

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorDetails = await response.text(); // 변경: 응답을 텍스트로 읽어 에러 디테일 포함
            throw new Error(`Failed to delete keyword: ${response.status} - ${errorDetails}`);
        }
        return response.json();
    } catch (error) {
        console.error('delKeyword Error: ', error.message);
        return false;
    }
};
