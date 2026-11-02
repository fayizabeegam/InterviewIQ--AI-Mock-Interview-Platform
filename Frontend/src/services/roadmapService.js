
import api from "./api";

// Fetch saved roadmaps for the authenticated user
export const fetchRoadmaps = async () => {
  const response = await api.get("roadmaps/");
  return response.data;
};

// Save a generated roadmap to Django
export const saveRoadmap = async (roadmapData) => {
  const response = await api.post("roadmaps/", roadmapData);
  return response.data;
};

// Update the status of a daily task
export const updateRoadmapTask = async (taskId, taskStatus) => {
  const response = await api.patch(
    `roadmaps/tasks/${taskId}/`,
    { status: taskStatus }
  );

  return response.data;
};
