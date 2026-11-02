
import api from "./api";

export const fetchCodingQuestions = async (params = {}) => {
  const response = await api.get("coding/questions/", { params });
  return response.data;
};

export const fetchCodingQuestionDetail = async (questionId) => {
  const response = await api.get(`coding/questions/${questionId}/`);
  return response.data;
};

export const fetchCodingSubmissions = async () => {
  const response = await api.get("coding/submissions/");
  return response.data;
};

export const submitCodingSolution = async (submissionData) => {
  const response = await api.post(
    "coding/submissions/",
    submissionData
  );
  return response.data;
};
