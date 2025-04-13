import {API} from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import {validateInput} from "../utils/ValidateInputUtil";
import {getToken} from "./localStorageService";

export const getProfileByUid = async (userId) => {
    return await httpClient.get(`${API.PROFILE_BY_UID}/${userId}`, {
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

export const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return await httpClient.patch(API.UPDATE_AVATAR, formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteAvatar = async () => {
    return await httpClient.delete(API.DELETE_AVATAR, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};
