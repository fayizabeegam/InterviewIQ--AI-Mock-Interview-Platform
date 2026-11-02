
import api from "./api";

export const getAdminDashboardStats = () =>
  api.get("admin/dashboard/stats/");

export const getAdminUsers = () =>
  api.get("admin/users/");

export const updateAdminUserStatus = (userId, isActive) =>
  api.patch(`admin/users/${userId}/status/`, {
    is_active: isActive,
  });


export const getAdminInterviews = () =>
  api.get("admin/interviews/");
