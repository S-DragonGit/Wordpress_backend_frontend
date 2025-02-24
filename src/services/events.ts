import { postData } from "../api/useApi";

export const fetchEvents = async (token: string, body: any) => {
    try {
        const response = await postData("/v2/user/dashboard/home", body, token);
        return response.data;
    } catch (err) {
        console.log(err+"err")
        return err;
    }
}

export const createEventApi = async (token: string, data: any) => {
    try {
        console.log("Request body: ", data);
        console.log("Token: ", token);
        const response = await postData("/v2/create/event", data, token);
        return response;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error; // Rethrow the error for proper error handling
    }
};

export const createZoomLinkApi = async (token: string, data: any) => {
    try {
        console.log("Request body: ", data);
        console.log("Token: ", token);
        const response = await postData("/v2/admin/generate-meeting", data, token);
        return response;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error; // Rethrow the error for proper error handling
    }
    
};
export const updateEventApi = async (token: string, data: any) => {
    try {
        console.log("Request body: ", data);
        console.log("Token: ", token);
        const response = await postData("/v2/update/event", data, token);
        return response;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error; // Rethrow the error for proper error handling
    }
};


export const getEventById = async (token: string, data: any) => {
    try {
        console.log("Request body: ", data);
        // console.log("Token: ", token);
        const response = await postData("/v2/get/event", data, token);
        return response;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error; // Rethrow the error for proper error handling
    }
};

export const updateEventStatusApi = async (token: string, data: any) => {
    try {
        console.log("Request body: ", data);
        // console.log("Token: ", token);
        const response = await postData("/v2/update/event/status", data, token);
        return response;
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error; // Rethrow the error for proper error handling
    }
};
