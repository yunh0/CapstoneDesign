export const postLogoutToken = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/oauth/logout'; // 로그아웃을 요청하는 API 경로

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Bad server condition');
        console.log("로그아웃 로직이 불려졌습니다.")
        return true;
    } catch (e) {
        console.error('postLogoutToken Error: ', e.message);
        return false;
    }
};
