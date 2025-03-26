import {API} from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import {getUid} from "./localStorageService";

export const getAllPosts = async (page = 1, limit = 20) => {
    return await httpClient.get(API.GET_ALL_POST, {
        params: {page, limit},
    });
};

export const getMyPosts = async (page = 1, limit = 20) => {
    return await httpClient.get(`${API.GET_MY_POST}/${getUid()}`, {
        params: {page, limit},
    });
};
