import httpClient from "../configurations/httpClient";
import {API} from "../configurations/configuration";

export const sendOtp = async (email) => {
    return await httpClient.post(`${API.SEND_OTP}?email=${email}`);
};

export const verificationOtpCode = async (email, otpCode) => {
    return await httpClient.post(API.VERIFY_OTP, {
        email: email,
        otpCode: otpCode,
    });
};
