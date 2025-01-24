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

export const createsEvents = async (token: string, body: any) => {
    try {
        console.log("token inside eventttt",token);
        
        const response = await postData("/v2/create/event", body, token);
        console.log("create event",response);
        return response.data;
        
    } catch (err) {
        console.log(err+"err")
        return err;
    }
}
