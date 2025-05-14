import httpClient from "../configurations/httpClient";
import { getToken } from "./localStorageService";

export const toggleLike = async (commentId, ownerId) => {
  return await httpClient.post(`/posts/comments/${commentId}/likes/toggle?ownerId=${ownerId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getAllUserLiked = async (commentId, page = 1, size = 10) => {
  return await httpClient.get(`/posts/comments/${commentId}/likes`, {
    params: { page, size },
  });
};
