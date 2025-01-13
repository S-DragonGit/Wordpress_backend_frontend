// src/api/fetchData.ts
import axiosInstance from './Axios';

export const fetchData = async (endpoint: string, token: string | null) => {
    const axios = axiosInstance(token);
    const response = await axios.get(endpoint);
    return response;
};


export const postData = async (endpoint: string, data: any, token: string | null) => {
    const axios = axiosInstance(token);
    const response = await axios.post(endpoint, data);
    return response;
};

export const putData = async (endpoint: string, data: any, token: string | null) => {
    const axios = axiosInstance(token); // Create instance with token
    const response = await axios.put(endpoint, data);
    return response;
};
export const deleteData = async (endpoint: string, token: string | null) => {
    const axios = axiosInstance(token); // Create instance with token
    const response = await axios.delete(endpoint);
    return response;
};