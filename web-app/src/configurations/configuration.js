
export const OAuthConfig = {
  clientId_facebook: "2093701427759325",
  clientId_google:
    "29090233792-mcdeijil6i0cjsdikigdfkokql6te7h9.apps.googleusercontent.com",
  redirectUri: "http://localhost:3001/authenticate",
  authUri_google: "https://accounts.google.com/o/oauth2/auth",
  authUri_facebook: "https://www.facebook.com/v22.0/dialog/oauth",
};

export const CONFIG = {
  API_GATEWAY: "http://localhost:8888/api/v1",
};

export const API = {
  LOGIN: "/identity/auth/login",
  OUTBOUND_LOGIN: "/identity/auth/outbound/authentication",
  REFRESH: "/identity/auth/refresh",
  REGISTER: "/identity/users",
  SEND_OTP: "/identity/otps",
  VERIFY_OTP: "/identity/otps/verification",
  RESET_PASSWORD: "/identity/password/reset",
  CHANGE_PASSWORD: "/identity/password/change",
  SET_PASSWORD: "/identity/password/set",
  MY_INFO: "/identity/users/myInfo",
  GET_PROFILE_BY_UID: "/profiles/users",
  GET_MY_PROFILE: "/profiles/users/my-profile",
  UPDATE_PROFILE: "/profiles/users",
  UPDATE_AVATAR: "/profiles/users/avatar",
  DELETE_AVATAR: "/profiles/users/avatar",
  GET_ALL_POST: "/posts",
  GET_POST_HISTORY: "/posts",
  GET_MY_POST: "/posts/users",
  CREATE_POST: "/posts",
  UPDATE_POST: "/posts",
  DELETE_POST: "/posts",
  GET_ALL_FRIENDS: `/profiles/users`,
  GET_FRIEND_SUGGESTIONS: `/profiles/friends/suggestions`,
  SEND_FRIEND_REQUEST: `/profiles/friends/requests`,
  CANCEL_FRIEND_REQUEST: `/profiles/friends/requests`,
  RESPOND_FRIEND_REQUEST: `/profiles/friends/requests`,
  UNFRIEND: `/profiles/friends`,
  TOGGLE_LIKE: `/posts`,
};
