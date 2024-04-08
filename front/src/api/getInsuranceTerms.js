export const getInsuranceTerms = async (insuranceType, insuranceCompany) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // Constructing the path with query parameters for type and company
    const path = `/api/files/terms?fileType=${encodeURIComponent(insuranceType)}&fileCompany=${encodeURIComponent(insuranceCompany)}`;

    try {
        const response = await fetch(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include', // This may vary based on your auth setup
        });
        console.log("Fetched Terms:", response);
        if (!response.ok) {
            throw new Error('Failed to fetch insurance terms');
        }
        return await response.json(); // Assuming the response is structured as needed
    } catch (e) {
        console.error('fetchInsuranceTerms Error:', e.message);
        return null; // Handle the error as appropriate for your use case
    }
};