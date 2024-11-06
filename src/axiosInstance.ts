import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    // other default settings
    withCredentials: true,
});

export default axiosInstance;

