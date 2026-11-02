import api from "./api";

export const getUserProfile = (token) => {
  return api.get("auth/profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserProfile = (token, data) => {
  return api.patch("auth/profile/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};