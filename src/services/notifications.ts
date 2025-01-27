import { postData } from "../api/useApi";

export const createNotificationApi = async (token: string, data: any) => {
    try {
        console.log("Request body: ", data);
        console.log("Token: ", token);
        const response = await postData("/v2/create/notification", data, token);
        return response;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error; // Rethrow the error for proper error handling
    }
};
