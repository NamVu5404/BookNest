import {API} from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import {validateInput} from "../utils/ValidateInputUtil";
import {getToken} from "./localStorageService";

export const getMyProfile = async (userId) => {
    return await httpClient.get(`${API.MY_PROFILE}/${userId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const updateProfile = async (userId, body) => {
    return await httpClient.put(
        `${API.MY_PROFILE}/${userId}`,
        validateInput(body),
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );
};
