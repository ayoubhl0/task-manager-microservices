import api from './api';

export const taskService = {
  getTasks: async (userId) => {
    const response = await api.get(`/tasks/user/${userId}`); // retirer /api
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData); // ok
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id, userId) => {
    const response = await api.delete(`/tasks/${id}`, {
      data: { user_id: userId }
    });
    return response.data;
  },

  getTaskStats: async (userId) => {
    const response = await api.get(`/tasks/stats/${userId}`);
    return response.data;
  }
};
