import {API} from "../configurations/configuration";
import httpClient from "../configurations/httpClient";

export const resetPassword = async (email, newPassword) => {
    return await httpClient.post(API.RESET_PASSWORD, {
        email: email,
        password: newPassword,
    });
};
