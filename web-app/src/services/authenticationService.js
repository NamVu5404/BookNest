import {getToken, removeToken, removeUid, setToken, setUid,} from "./localStorageService";
import httpClient from "../configurations/httpClient";
import {API} from "../configurations/configuration";

// Thêm interceptor để tự động refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Function để thêm các request vào hàng đợi
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Function để thông báo cho các request đang chờ
const onRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

// Hàm giải mã JWT để lấy thông tin
const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// Kiểm tra access time của token
export const isTokenAccessExpired = (token) => {
    if (!token) return true;

    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
};

// Kiểm tra refresh time của token (dựa vào thời gian issue + REFRESHABLE_DURATION)
export const isTokenRefreshExpired = (token) => {
    if (!token) return true;

    const decoded = parseJwt(token);
    if (!decoded || !decoded.iat) return true;

    // REFRESHABLE_DURATION là thời gian refresh được tính từ lúc token được tạo
    // Điều chỉnh giá trị này theo cấu hình của backend
    const REFRESHABLE_DURATION = 72; // 72 giờ
    const refreshExpiry = (decoded.iat + REFRESHABLE_DURATION * 60 * 60) * 1000;

    return refreshExpiry < Date.now();
};

// Hàm refresh token
export const refreshToken = async () => {
    const token = getToken();

    if (!token || isTokenRefreshExpired(token)) {
        // Nếu không có token hoặc token đã hết thời gian refresh
        logOut();
        return Promise.reject(new Error("Token refresh time expired"));
    }

    try {
        const response = await httpClient.post(API.REFRESH, {token});
        const newToken = response.data?.result?.token;

        if (newToken) {
            setToken(newToken);
            return newToken;
        } else {
            return Promise.reject(new Error("Invalid refresh response"));
        }
    } catch (error) {
        // Nếu refresh thất bại, logout người dùng
        logOut();
        return Promise.reject(error);
    }
};

// Thiết lập interceptor cho httpClient
httpClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Khi server trả về mã lỗi 401 (Unauthorized) và chưa thử refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            const token = getToken();

            // Nếu token không tồn tại hoặc đã hết thời gian refresh
            if (!token || isTokenRefreshExpired(token)) {
                logOut();
                return Promise.reject(error);
            }

            // Nếu token hết thời gian access nhưng vẫn còn thời gian refresh
            if (isTokenAccessExpired(token) && !isTokenRefreshExpired(token)) {
                originalRequest._retry = true;

                if (!isRefreshing) {
                    isRefreshing = true;

                    try {
                        // Gọi API refresh token
                        const newToken = await refreshToken();

                        // Thông báo cho các request đang chờ
                        onRefreshed(newToken);
                        isRefreshing = false;

                        // Cập nhật token cho request hiện tại và thử lại
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return httpClient(originalRequest);
                    } catch (refreshError) {
                        isRefreshing = false;
                        logOut();
                        return Promise.reject(refreshError);
                    }
                } else {
                    // Nếu đang refresh, thêm request này vào hàng đợi
                    return new Promise((resolve) => {
                        addRefreshSubscriber((newToken) => {
                            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                            resolve(httpClient(originalRequest));
                        });
                    });
                }
            }
        }

        return Promise.reject(error);
    }
);

// Kiểm tra xác thực và tự động refresh nếu token sắp hết hạn
export const checkAuthAndRefreshIfNeeded = async () => {
    const token = getToken();
    if (!token) return false;

    if (isTokenRefreshExpired(token)) {
        // Token đã hết thời gian refresh, logout
        logOut();
        return false;
    }

    if (isTokenAccessExpired(token)) {
        // Token đã hết thời gian access nhưng vẫn còn thời gian refresh
        try {
            await refreshToken();
            return true;
        } catch (error) {
            return false;
        }
    }

    // Token vẫn còn hạn dùng
    return true;
};

export const logIn = async (email, password) => {
    const response = await httpClient.post(API.LOGIN, {
        email: email,
        password: password,
    });

    setToken(response.data?.result?.token);
    setUid(response.data?.result?.userId);

    return response;
};

export const outboundLogin = async (provider, authCode) => {
    const response = await httpClient.post(
        `${API.OUTBOUND_LOGIN}?provider=${provider}&code=${authCode}`
    );

    setToken(response.data?.result?.token);
    setUid(response.data?.result?.userId);

    return response;
};

export const logOut = () => {
    removeToken();
    removeUid();
};

export const isAuthenticated = () => {
    return getToken();
};

// Tự động check token và refresh khi load trang
export const initializeAuth = () => {
    checkAuthAndRefreshIfNeeded();
};
