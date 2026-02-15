import api from './api';

const cartService = {
    getAll: async (limit = 12, skip = 0) => {
        const response = await api.get(`/carts?limit=${limit}&skip=${skip}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/carts/${id}`);
        return response.data;
    },

    getByUser: async (userId) => {
        const response = await api.get(`/carts/user/${userId}`);
        return response.data;
    },

    add: async (data) => {
        const response = await api.post('/carts/add', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/carts/${id}`, data);
        return response.data;
    },

    remove: async (id) => {
        const response = await api.delete(`/carts/${id}`);
        return response.data;
    },
};

export default cartService;
