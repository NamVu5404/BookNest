import {API} from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import {validateInput} from "../utils/ValidateInputUtil";
import {getToken} from "./localStorageService";

export const register = async (body) => {
    return await httpClient.post(API.REGISTER, validateInput(body));
};

export const getMyInfo = async () => {
    return await httpClient.get(API.MY_INFO, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};
