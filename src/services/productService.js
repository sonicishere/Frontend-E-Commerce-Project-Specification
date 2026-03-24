import api from './api';

const LOCAL_KEY = 'localProducts';
const DELETED_KEY = 'deletedProducts';
const UPDATED_KEY = 'updatedProducts';

function getLocal(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function setLocal(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

let nextLocalId = parseInt(localStorage.getItem('nextProductId')) || 10000;
function getNextId() {
    nextLocalId++;
    localStorage.setItem('nextProductId', nextLocalId.toString());
    return nextLocalId;
}

const productService = {
    getAll: async (limit = 12, skip = 0, sortBy = '', order = '') => {
        let url = `/products?limit=${limit}&skip=${skip}`;
        if (sortBy) url += `&sortBy=${sortBy}&order=${order || 'asc'}`;
        const response = await api.get(url);
        const data = response.data;

        const deletedIds = getLocal(DELETED_KEY);
        const updates = getLocal(UPDATED_KEY);
        const localProducts = getLocal(LOCAL_KEY);

        // Filter out deleted, apply updates
        let products = data.products
            .filter(p => !deletedIds.includes(p.id))
            .map(p => {
                const upd = updates.find(u => u.id === p.id);
                return upd ? { ...p, ...upd } : p;
            });

        // Add local products at the beginning
        const allProducts = [...localProducts, ...products];

        return {
            ...data,
            products: allProducts.slice(0, limit),
            total: data.total - deletedIds.length + localProducts.length,
        };
    },

    getById: async (id) => {
        const numId = Number(id);
        // Check local products first
        const localProducts = getLocal(LOCAL_KEY);
        const localProduct = localProducts.find(p => p.id === numId);
        if (localProduct) return localProduct;

        // Check updates
        const updates = getLocal(UPDATED_KEY);
        const response = await api.get(`/products/${id}`);
        const upd = updates.find(u => u.id === numId);
        return upd ? { ...response.data, ...upd } : response.data;
    },

    search: async (query, limit = 12, skip = 0) => {
        const response = await api.get(`/products/search?q=${query}&limit=${limit}&skip=${skip}`);
        const data = response.data;
        const deletedIds = getLocal(DELETED_KEY);
        const localProducts = getLocal(LOCAL_KEY);

        // Filter local products by search query
        const q = query.toLowerCase();
        const matchingLocal = localProducts.filter(p =>
            p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        );

        let products = data.products.filter(p => !deletedIds.includes(p.id));
        return { ...data, products: [...matchingLocal, ...products], total: data.total + matchingLocal.length };
    },

    getByCategory: async (category, limit = 12, skip = 0) => {
        const response = await api.get(`/products/category/${category}?limit=${limit}&skip=${skip}`);
        const data = response.data;
        const deletedIds = getLocal(DELETED_KEY);
        const localProducts = getLocal(LOCAL_KEY);
        const matchingLocal = localProducts.filter(p => p.category === category);

        let products = data.products.filter(p => !deletedIds.includes(p.id));
        return { ...data, products: [...matchingLocal, ...products], total: data.total + matchingLocal.length };
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
        // Also call API for simulation
        const response = await api.post('/products/add', data);
        const newProduct = {
            ...response.data,
            ...data,
            id: getNextId(),
            thumbnail: data.thumbnail || 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
            images: data.images || ['https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png'],
            rating: 0,
            reviews: [],
            discountPercentage: 0,
        };
        const localProducts = getLocal(LOCAL_KEY);
        localProducts.unshift(newProduct);
        setLocal(LOCAL_KEY, localProducts);
        return newProduct;
    },

    update: async (id, data) => {
        const numId = Number(id);
        const localProducts = getLocal(LOCAL_KEY);
        const localIdx = localProducts.findIndex(p => p.id === numId);

        if (localIdx !== -1) {
            // Update local product
            localProducts[localIdx] = { ...localProducts[localIdx], ...data };
            setLocal(LOCAL_KEY, localProducts);
            return localProducts[localIdx];
        }

        // Update API product - save to updates list
        await api.put(`/products/${id}`, data);
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
        const localProducts = getLocal(LOCAL_KEY);
        const localIdx = localProducts.findIndex(p => p.id === numId);

        if (localIdx !== -1) {
            // Remove local product
            localProducts.splice(localIdx, 1);
            setLocal(LOCAL_KEY, localProducts);
        } else {
            // Mark API product as deleted
            await api.delete(`/products/${id}`);
            const deletedIds = getLocal(DELETED_KEY);
            if (!deletedIds.includes(numId)) {
                deletedIds.push(numId);
                setLocal(DELETED_KEY, deletedIds);
            }
        }
        return { id: numId, isDeleted: true };
    },
};

export default productService;
