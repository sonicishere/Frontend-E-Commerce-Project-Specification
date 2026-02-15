import api from './api';

const productService = {
    getAll: async (limit = 12, skip = 0, sortBy = '', order = '') => {
        let url = `/products?limit=${limit}&skip=${skip}`;
        if (sortBy) url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
        const response = await api.get(url);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    search: async (query, limit = 12, skip = 0) => {
        const response = await api.get(`/products/search?q=${query}&limit=${limit}&skip=${skip}`);
        return response.data;
    },

    getByCategory: async (category, limit = 12, skip = 0) => {
        const response = await api.get(`/products/category/${category}?limit=${limit}&skip=${skip}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/products/categories');
        return response.data;
    },

    getCategoryList: async () => {
        const response = await api.get('/products/category-list');
        return response.data;
    },

    add: async (data) => {
        const response = await api.post('/products/add', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    remove: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};

export default productService;
