import api from "./api";

export const createInterview = (data, token) => {
  return api.post(
    "interviews/",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const startInterview = (interviewId, token) => {
  return api.post(
    `interviews/${interviewId}/start/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const saveInterviewQuestions = (interviewId,questions,token) => {
    return api.post(
        `interviews/${interviewId}/questions/`,
        {
        questions,
        },
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
};

export const getInterviewDetail = (interviewId, token) => {
  return api.get(
    `interviews/${interviewId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const completeInterview = (interviewId, token) => {
  return api.post(
    `interviews/${interviewId}/complete/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
