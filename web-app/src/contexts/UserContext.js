import React, {createContext, useContext, useEffect, useReducer} from "react";
import {getUid} from "../services/localStorageService";
import {getMyProfile} from "../services/profileService";

// Khởi tạo context
const UserContext = createContext();

// Khởi tạo reducer
const userReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {...state, userDetails: action.payload};
        case "CLEAR_USER":
            return {...state, userDetails: null};
        default:
            return state;
    }
};

// Provider component
export const UserProvider = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, {userDetails: null});

    useEffect(() => {
        const fetchUser = async () => {
            const uid = getUid();
            if (!uid) return;

            try {
                const response = await getMyProfile(uid);
                dispatch({type: "SET_USER", payload: response.data.result});
            } catch (error) {
                console.error("Error fetching user details", error);
                dispatch({type: "CLEAR_USER"});
            }
        };

        fetchUser();
    }, []);

    // Hàm cập nhật user khi đăng nhập
    const updateUser = async () => {
        const uid = getUid();
        if (!uid) return dispatch({type: "CLEAR_USER"});

        try {
            const response = await getMyProfile(uid);
            dispatch({type: "SET_USER", payload: response.data.result});
        } catch (error) {
            console.error("Error updating user details", error);
            dispatch({type: "CLEAR_USER"});
        }
    };

    return (
        <UserContext.Provider
            value={{userDetails: state.userDetails, updateUser}}
        >
            {children}
        </UserContext.Provider>
    );
};

// Hook để sử dụng userDetails trong component
export const useUserDetails = () => useContext(UserContext);
