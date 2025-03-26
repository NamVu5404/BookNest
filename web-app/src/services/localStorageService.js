export const KEY_TOKEN = "accessToken";
export const KEY_UID = "uid";

export const setToken = (token) => {
    localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
    return localStorage.removeItem(KEY_TOKEN);
};

export const setUid = (uid) => {
    localStorage.setItem(KEY_UID, uid);
};

export const getUid = () => {
    return localStorage.getItem(KEY_UID);
};

export const removeUid = () => {
    return localStorage.removeItem(KEY_UID);
};
