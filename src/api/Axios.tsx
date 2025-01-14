import axios from 'axios';
import { UserLogout } from '../app/redux/userSlice';
import { Store } from '../app/redux/store';

const AxiosInstance = (token: string | null) => {
    const instance = axios.create({
        // baseURL: import.meta.env.VITE_BASE_URL,
        baseURL: "/api",
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });

    // Interceptor to dynamically set the Content-Type based on request data
    instance.interceptors.request.use(
        (config) => {
            // Check if data is FormData; set Content-Type accordingly
            if (config.data instanceof FormData) {
                config.headers['Content-Type'] = 'multipart/form-data';
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors
    instance.interceptors.response.use(
        (response) => response, // If successful, just return the response
        (error) => {
            if (error.response && error.response.status === 401) {
                // Dispatch logout action if unauthorized
                Store.dispatch(UserLogout());
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default AxiosInstance;
