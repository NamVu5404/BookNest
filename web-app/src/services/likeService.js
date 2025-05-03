import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken } from "./localStorageService";

export const toggleLike = async (postId) => {
  return await httpClient.post(`${API.TOGGLE_LIKE}/${postId}/likes/toggle`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
