import api from "./api";


export const getJobs = (token) => {
  return api.get("jobs/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getJobDetail = (jobId, token) => {
  return api.get(`jobs/${jobId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createJob = (data, token) => {
  return api.post(
    "jobs/",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const updateJob = (jobId, data, token) => {
  return api.patch(
    `jobs/${jobId}/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const deleteJob = (jobId, token) => {
  return api.delete(
    `jobs/${jobId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const saveJobSkills = (
  jobId,
  data,
  token
) => {
  return api.post(
    `jobs/${jobId}/skills/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};