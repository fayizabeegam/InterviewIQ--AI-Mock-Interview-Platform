import api from "./api";

export const getResumes = (token) => {
    return api.get("resumes/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


export const getResumeDetail = (resumeId, token) => {
    return api.get(`resumes/${resumeId}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


export const uploadResume = (formData, token) => {
  return api.post("resumes/upload/", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const saveParsedResumeData = (
  resumeId,
  parsedData,
  token
) => {
  return api.post(
    `resumes/${resumeId}/parsed-data/`,
    parsedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getATSAnalysis = (resumeId, token) => {
  return api.get(
    `resumes/${resumeId}/ats-analysis/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const saveATSAnalysis = (
  resumeId,
  atsData,
  token
) => {
  return api.post(
    `resumes/${resumeId}/ats-analysis/`,
    atsData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};