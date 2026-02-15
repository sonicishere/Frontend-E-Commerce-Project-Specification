import api from './api';

const userService = {
    getAll: async (limit = 12, skip = 0, sortBy = '', order = '') => {
        let url = `/users?limit=${limit}&skip=${skip}`;
        if (sortBy) url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
        const response = await api.get(url);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    search: async (query, limit = 12, skip = 0) => {
        const response = await api.get(`/users/search?q=${query}&limit=${limit}&skip=${skip}`);
        return response.data;
    },

    filter: async (key, value, limit = 12, skip = 0) => {
        const response = await api.get(`/users/filter?key=${key}&value=${value}&limit=${limit}&skip=${skip}`);
        return response.data;
    },

    add: async (data) => {
        const response = await api.post('/users/add', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    remove: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

export default userService;
