import React, {createContext, useContext, useEffect, useState} from "react";
import {checkAuthAndRefreshIfNeeded, initializeAuth,} from "../services/authenticationService";
import {getUid} from "../services/localStorageService";

// Tạo context cho authentication
const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    // Kiểm tra trạng thái đăng nhập khi trang web được tải
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isAuth = await checkAuthAndRefreshIfNeeded();
                if (isAuth) {
                    setUserId(getUid());
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        // Khởi tạo auth và kiểm tra trạng thái
        initializeAuth();
        checkAuth();

        // Thiết lập kiểm tra định kỳ cho token
        const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
                checkAuthAndRefreshIfNeeded();
            }
        }, 5 * 60 * 1000); // Kiểm tra mỗi 5 phút khi tab đang mở

        // Kiểm tra token khi tab được focus lại
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkAuthAndRefreshIfNeeded();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Giá trị context được cung cấp
    const contextValue = {
        userId,
        loading,
        checkAuth: checkAuthAndRefreshIfNeeded,
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

// Hook để sử dụng context auth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
