export const getInsuranceType = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/files/types'; // 수정된 부분

    try {
        const response = await fetch(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include', // Adjust according to your auth setup
        });
        console.log("getInsuranceType: ",response);
        if (!response.ok) throw new Error('Failed to fetch insurance info');
        return await response.json(); // Assuming the response is in the desired structured format
    } catch (e) {
        console.error('getInsuranceType Error:', e.message);
        return null; // Returning null or appropriate error handling
    }
};
