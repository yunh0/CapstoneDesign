export const postInsuranceTerms = async (newChat) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const path = '/api/insurance/terms';

    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( newChat ),
        });
        if (!response.ok) throw new Error('bad server condition');
        return true;
    } catch (e) {
        console.error('postInsuranceTerms Error: ', e.message);
        return false;
    }
};