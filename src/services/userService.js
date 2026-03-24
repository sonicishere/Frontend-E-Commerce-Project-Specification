import api from './api';

const LOCAL_KEY = 'localUsers';
const DELETED_KEY = 'deletedUsers';
const UPDATED_KEY = 'updatedUsers';

function getLocal(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function setLocal(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

let nextLocalId = parseInt(localStorage.getItem('nextUserId')) || 10000;
function getNextId() {
    nextLocalId++;
    localStorage.setItem('nextUserId', nextLocalId.toString());
    return nextLocalId;
}

const userService = {
    getAll: async (limit = 12, skip = 0, sortBy = '', order = '') => {
        let url = `/users?limit=${limit}&skip=${skip}`;
        if (sortBy) url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
        const response = await api.get(url);
        const data = response.data;

        const deletedIds = getLocal(DELETED_KEY);
        const updates = getLocal(UPDATED_KEY);
        const localUsers = getLocal(LOCAL_KEY);

        let users = data.users
            .filter(u => !deletedIds.includes(u.id))
            .map(u => {
                const upd = updates.find(x => x.id === u.id);
                return upd ? { ...u, ...upd } : u;
            });

        const allUsers = [...localUsers, ...users];

        return {
            ...data,
            users: allUsers.slice(0, limit),
            total: data.total - deletedIds.length + localUsers.length,
        };
    },

    getById: async (id) => {
        const numId = Number(id);
        const localUsers = getLocal(LOCAL_KEY);
        const localUser = localUsers.find(u => u.id === numId);
        if (localUser) return localUser;

        const response = await api.get(`/users/${id}`);
        const updates = getLocal(UPDATED_KEY);
        const upd = updates.find(u => u.id === numId);
        return upd ? { ...response.data, ...upd } : response.data;
    },

    search: async (query, limit = 12, skip = 0) => {
        const response = await api.get(`/users/search?q=${query}&limit=${limit}&skip=${skip}`);
        const data = response.data;
        const deletedIds = getLocal(DELETED_KEY);
        const localUsers = getLocal(LOCAL_KEY);
        const q = query.toLowerCase();
        const matchingLocal = localUsers.filter(u =>
            u.firstName?.toLowerCase().includes(q) || u.lastName?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q)
        );
        let users = data.users.filter(u => !deletedIds.includes(u.id));
        return { ...data, users: [...matchingLocal, ...users], total: data.total + matchingLocal.length };
    },

    filter: async (key, value, limit = 12, skip = 0) => {
        const response = await api.get(`/users/filter?key=${key}&value=${value}&limit=${limit}&skip=${skip}`);
        return response.data;
    },

    add: async (data) => {
        const response = await api.post('/users/add', data);
        const newUser = {
            ...response.data,
            ...data,
            id: getNextId(),
            image: `https://dummyjson.com/icon/${data.username || 'user'}/128`,
            role: 'user',
        };
        const localUsers = getLocal(LOCAL_KEY);
        localUsers.unshift(newUser);
        setLocal(LOCAL_KEY, localUsers);
        return newUser;
    },

    update: async (id, data) => {
        const numId = Number(id);
        const localUsers = getLocal(LOCAL_KEY);
        const localIdx = localUsers.findIndex(u => u.id === numId);

        if (localIdx !== -1) {
            localUsers[localIdx] = { ...localUsers[localIdx], ...data };
            setLocal(LOCAL_KEY, localUsers);
            return localUsers[localIdx];
        }

        await api.put(`/users/${id}`, data);
        const updates = getLocal(UPDATED_KEY);
        const existingIdx = updates.findIndex(u => u.id === numId);
        if (existingIdx !== -1) {
            updates[existingIdx] = { ...updates[existingIdx], ...data, id: numId };
        } else {
            updates.push({ ...data, id: numId });
        }
        setLocal(UPDATED_KEY, updates);
        return { id: numId, ...data };
    },

    remove: async (id) => {
        const numId = Number(id);
        const localUsers = getLocal(LOCAL_KEY);
        const localIdx = localUsers.findIndex(u => u.id === numId);

        if (localIdx !== -1) {
            localUsers.splice(localIdx, 1);
            setLocal(LOCAL_KEY, localUsers);
        } else {
            await api.delete(`/users/${id}`);
            const deletedIds = getLocal(DELETED_KEY);
            if (!deletedIds.includes(numId)) {
                deletedIds.push(numId);
                setLocal(DELETED_KEY, deletedIds);
            }
        }
        return { id: numId, isDeleted: true };
    },
};

export default userService;
