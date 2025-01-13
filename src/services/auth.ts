import { postData } from "../api/useApi";

export const authApi = async (body: any) => {
    try {
        const response = await postData("/v2/user/login", body, null);
        return response;
    } catch (err) {
        return err;
    }
}
