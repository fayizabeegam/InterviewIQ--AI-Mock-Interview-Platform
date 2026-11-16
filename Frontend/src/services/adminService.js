
import api from "./api";


// dashboard
export const getAdminDashboardStats = () =>
  api.get("admin/dashboard/stats/");


// users
export const getAdminUsers = () =>
  api.get("admin/users/");

export const updateAdminUserStatus = (userId, isActive) =>
  api.patch(`admin/users/${userId}/status/`, {
    is_active: isActive,
  });

export const getAdminUserDetail = async (userId) => {
  const response = await api.get(`admin/users/${userId}/`);
  return response.data.data;
};


//  interview
export const getAdminInterviews = () =>
  api.get("admin/interviews/");


export const getAdminInterviewDetail = (interviewId) =>
  api.get(`admin/interviews/${interviewId}/`);



// bulk upload
export const uploadCodingQuestions = async (difficulty, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `admin/coding/${difficulty.toLowerCase()}/bulk-upload/`,
    formData
  );

  return response.data;
};


// Get coding question statistics
export const getCodingQuestionStats = async () => {
  const response = await api.get("admin/coding/stats/");
  return response.data;
};


// Get all coding questions
export const getCodingQuestions = async () => {
  const response = await api.get("admin/coding/questions/");
  return response.data;
};

// Get coding question details
export const getCodingQuestionDetail = async (questionId) => {
  const response = await api.get(
    `admin/coding/questions/${questionId}/`
  );
  return response.data;
};

// Delete a coding question
export const deleteCodingQuestion = async (questionId) => {
  const response = await api.delete(
    `admin/coding/questions/${questionId}/`
  );
  return response.data;
};


export const createCodingQuestion = async (data) => {
  const response = await api.post(
    "admin/coding/questions/create/",
    data
  );
  return response.data;
};

export const updateCodingQuestion = async (questionId, data) => {
  const response = await api.put(
    `admin/coding/questions/${questionId}/update/`,
    data
  );
  return response.data;
};

// ---------------- RESUMES ----------------

// Get resume statistics
export const getAdminResumeStats = async () => {
  const response = await api.get("admin/resumes/stats/");
  return response.data;
};

// Get all resumes with search, filters and pagination
export const getAdminResumes = async (params = {}) => {
  const response = await api.get("admin/resumes/", { params });
  return response.data;
};

// Delete a resume
export const deleteAdminResume = async (resumeId) => {
  const response = await api.delete(
    `admin/resumes/${resumeId}/delete/`
  );
  return response.data;
};

// Download a resume
export const downloadAdminResume = async (resumeId) => {
  const response = await api.get(
    `admin/resumes/${resumeId}/download/`,
    {
      responseType: "blob",
    }
  );

  return response;
};

// Get resume details
export const getAdminResumeDetails = async (resumeId) => {
  const response = await api.get(`admin/resumes/${resumeId}/`);
  return response.data;
};

// ===============================
// ADMIN SETTINGS
// ===============================

export const getAdminGeneralSettings = () => {
  return api.get("admin/settings/general/");
};

export const updateAdminGeneralSettings = (data) => {
  return api.patch("admin/settings/general/", data);
};


// ===============================
// ADMIN PROFILE SETTINGS
// ===============================

export const getAdminProfile = () => {
  return api.get("auth/profile/");
};

export const updateAdminProfile = (data) => {
  return api.patch("auth/profile/", data);
};

// ===============================
// ADMIN PASSWORD SETTINGS
// ===============================

export const sendAdminPasswordOTP = async () => {
  const response = await api.post(
    "auth/change-password/send-otp/"
  );
  return response.data;
};

export const changeAdminPassword = async (data) => {
  const response = await api.post(
    "auth/change-password/",
    data
  );
  return response.data;
};
