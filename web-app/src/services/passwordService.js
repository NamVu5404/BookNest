import {API} from "../configurations/configuration";
import httpClient from "../configurations/httpClient";

export const resetPassword = async (email, newPassword) => {
    return await httpClient.post(API.RESET_PASSWORD, {
        email: email,
        password: newPassword,
    });
};

export const changePassword = async (body) => {
    return await httpClient.put(API.CHANGE_PASSWORD, body);
};

export const setPassword = async (body) => {
    return await httpClient.put(API.SET_PASSWORD, body);
};