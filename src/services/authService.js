import api from './api';

const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', {
            username,
            password,
            expiresInMins: 60,
        });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    refresh: async (refreshToken) => {
        const response = await api.post('/auth/refresh', {
            refreshToken,
            expiresInMins: 60,
        });
        return response.data;
    },
};

export default authService;
