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
    MY_PROFILE: "/profile/users",
    UPDATE_PROFILE: "/profile/users",
    GET_ALL_POST: "/post/posts",
    GET_POST_HISTORY: "/post/posts",
    GET_MY_POST: "/post/posts/users",
    CREATE_POST: "/post/posts",
    UPDATE_POST: "/post/posts",
    DELETE_POST: "/post/posts",
};
