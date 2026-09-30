import api from "./api";

export const registerUser = (data) => {
    return api.post("auth/register/", data);
};

export const verifyEmail = (data) => {
    return api.post("auth/verify-email/", data);
};

export const resendOTP = (data) => {
    return api.post("auth/resend-otp/", data);
};

export const loginUser = (data) => {
    return api.post("auth/login/", data);
};

export const forgotPassword = (data) => {
    return api.post("auth/forgot-password/", data);
};

export const resetPassword = (data) => {
    return api.post("auth/reset-password/", data);
};

export const sendChangePasswordOTP = (token) => {
    return api.post(
        "auth/change-password/send-otp/",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const changePassword = (data, token) => {
    return api.post(
        "auth/change-password/",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

export const logoutUser = (refresh, token) => {
    return api.post(
        "auth/logout/",
        { refresh },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};