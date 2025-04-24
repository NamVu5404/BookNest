import { API } from "../configurations/configuration";
import httpClient from "../configurations/httpClient";
import { getToken, getUid } from "./localStorageService";

export const getAllFriends = async (userId, lastUserId = "", limit = 18) => {
  return await httpClient.get(
    `${API.GET_ALL_FRIENDS}/${userId}/friends`,
    {
      params: { lastUserId, limit },
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

export const getFriendSuggestions = async (
  userId,
  lastUserId = "",
  limit = 18
) => {
  return await httpClient.get(
    API.GET_FRIEND_SUGGESTIONS,
    {
      params: { userId, lastUserId, limit },
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

export const getFriendRequestsReceived = async () => {
  return await httpClient.get(
    `${API.GET_ALL_FRIENDS}/${getUid()}/friends/requests/received`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

export const getFriendRequestsSent = async () => {
  return await httpClient.get(
    `${API.GET_ALL_FRIENDS}/${getUid()}/friends/requests/sent`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

export const sendFriendRequest = async (receiverId) => {
  return await httpClient.post(
    API.SEND_FRIEND_REQUEST,
    {
      receiverId: receiverId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

export const cancelFriendRequest = async (receiverId) => {
  return await httpClient.delete(`${API.CANCEL_FRIEND_REQUEST}/${receiverId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const respondFriendRequest = async (senderId, action) => {
  return await httpClient.put(
    `${API.RESPOND_FRIEND_REQUEST}/${senderId}`,
    {}, // body trống
    {
      params: { action }, // query string
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

export const unfriend = async (friendId) => {
  return await httpClient.delete(`${API.UNFRIEND}/${friendId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
