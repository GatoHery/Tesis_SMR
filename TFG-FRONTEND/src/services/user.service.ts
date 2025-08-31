import api from "@/api/axiosInstance";

const USER_PATH = '/users';

export const userService = {
  fetchUsers: async () => {
    const res = await api.get(`${USER_PATH}`, { withCredentials: true });

    return res.data;
  },

  fetchUserStats: async () => {
    const res = await api.get(`${USER_PATH}/stats`, { withCredentials: true });

    return res.data;
  },

  createUser: async (email: string, name: string, password: string) => {
    const res = await api.post(`${USER_PATH}`, {
      email,
      name,
      password,
      role: '68450b1f1109e077f3d2a80f', // Default role ID
    }, { withCredentials: true });

    return res.data;
  }
};