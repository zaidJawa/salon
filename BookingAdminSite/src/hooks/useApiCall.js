import {
    useState
} from 'react';
import axios from 'axios';

export const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
});

export const PDF_API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    responseType: "blob",
    headers: {
        Accept: "application/pdf",
    },
    withCredentials: true,

});

const addInterceptors = (axiosInstance) => {
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response?.status === 403) {
                localStorage.clear();
                window.location.reload();
            }
            return Promise.reject(error);
        }
    );
};
addInterceptors(API);
addInterceptors(PDF_API);

const useApiCall = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const apiCall = async (url, method = 'GET', data = null) => {
        setLoading(true);
        setErrorMessage('');

        try {
            const {
                data: responseData,
                status
            } = await API({
                url,
                method,
                data
            });

            // Check if the status code is between 200 and 399 (inclusive)
            if (status >= 200 && status < 400) {
                return responseData;
            }

            throw new Error('Request failed');
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'An error occurred';
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        errorMessage,
        apiCall,
        setErrorMessage
    };
};

export default useApiCall;