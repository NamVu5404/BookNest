import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken, getUid } from "./localStorageService";

export const getAllPosts = async (page = 1, size = 10) => {
  return await httpClient.get(API.GET_ALL_POST, {
    params: { page, size },
  });
};

export const getMyPosts = async (page = 1, size = 10) => {
  return await httpClient.get(`${API.GET_MY_POST}/${getUid()}`, {
    params: { page, size },
  });
};

export const getUserPosts = async (userId, page = 1, size = 10) => {
  return await httpClient.get(`${API.GET_MY_POST}/${userId}`, {
    params: { page, size },
  });
};

export const getPostHistory = async (postId, page = 1, size = 10) => {
  return await httpClient.get(`${API.GET_POST_HISTORY}/${postId}/edit-history`, {
    params: { page, size },
  });
};

export const createPost = async (body) => {
  return await httpClient.post(API.CREATE_POST, body, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const updatePost = async (id, body) => {
  return await httpClient.put(`${API.UPDATE_POST}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const deletePost = async (id) => {
  return await httpClient.delete(`${API.DELETE_POST}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
