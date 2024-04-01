export const getInsuranceCompany = async (fileType) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = `/api/files/companies?fileType=${encodeURIComponent(fileType)}`;

    try {
        const response = await fetch(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include', // Adjust according to your auth setup
        });
        console.log("getInsuranceCompany: ",response);
        if (!response.ok) throw new Error('Failed to fetch insurance companies');
        return await response.json();
    } catch (e) {
        console.error('getInsuranceCompany Error:', e.message);
        return null;
    }
};
