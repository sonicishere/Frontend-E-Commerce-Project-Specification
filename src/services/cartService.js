import api from './api';

const LOCAL_KEY = 'localCarts';
const DELETED_KEY = 'deletedCarts';
const UPDATED_KEY = 'updatedCarts';

function getLocal(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function setLocal(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

let nextLocalId = parseInt(localStorage.getItem('nextCartId')) || 10000;
function getNextId() {
    nextLocalId++;
    localStorage.setItem('nextCartId', nextLocalId.toString());
    return nextLocalId;
}

const cartService = {
    getAll: async (limit = 12, skip = 0) => {
        const response = await api.get(`/carts?limit=${limit}&skip=${skip}`);
        const data = response.data;

        const deletedIds = getLocal(DELETED_KEY);
        const updates = getLocal(UPDATED_KEY);
        const localCarts = getLocal(LOCAL_KEY);

        let carts = data.carts
            .filter(c => !deletedIds.includes(c.id))
            .map(c => {
                const upd = updates.find(x => x.id === c.id);
                return upd ? { ...c, ...upd } : c;
            });

        const allCarts = [...localCarts, ...carts];

        return {
            ...data,
            carts: allCarts.slice(0, limit),
            total: data.total - deletedIds.length + localCarts.length,
        };
    },

    getById: async (id) => {
        const numId = Number(id);
        const localCarts = getLocal(LOCAL_KEY);
        const localCart = localCarts.find(c => c.id === numId);
        if (localCart) return localCart;

        const response = await api.get(`/carts/${id}`);
        const updates = getLocal(UPDATED_KEY);
        const upd = updates.find(c => c.id === numId);
        return upd ? { ...response.data, ...upd } : response.data;
    },

    getByUser: async (userId) => {
        const response = await api.get(`/carts/user/${userId}`);
        return response.data;
    },

    add: async (data) => {
        const response = await api.post('/carts/add', data);
        const newCart = {
            ...response.data,
            ...data,
            id: getNextId(),
            totalProducts: data.products?.length || 0,
            totalQuantity: data.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0,
            total: 0,
            discountedTotal: 0,
        };
        const localCarts = getLocal(LOCAL_KEY);
        localCarts.unshift(newCart);
        setLocal(LOCAL_KEY, localCarts);
        return newCart;
    },

    update: async (id, data) => {
        const numId = Number(id);
        const localCarts = getLocal(LOCAL_KEY);
        const localIdx = localCarts.findIndex(c => c.id === numId);

        if (localIdx !== -1) {
            localCarts[localIdx] = { ...localCarts[localIdx], ...data };
            setLocal(LOCAL_KEY, localCarts);
            return localCarts[localIdx];
        }

        await api.put(`/carts/${id}`, data);
        const updates = getLocal(UPDATED_KEY);
        const existingIdx = updates.findIndex(c => c.id === numId);
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
        const localCarts = getLocal(LOCAL_KEY);
        const localIdx = localCarts.findIndex(c => c.id === numId);

        if (localIdx !== -1) {
            localCarts.splice(localIdx, 1);
            setLocal(LOCAL_KEY, localCarts);
        } else {
            await api.delete(`/carts/${id}`);
            const deletedIds = getLocal(DELETED_KEY);
            if (!deletedIds.includes(numId)) {
                deletedIds.push(numId);
                setLocal(DELETED_KEY, deletedIds);
            }
        }
        return { id: numId, isDeleted: true };
    },
};

export default cartService;
