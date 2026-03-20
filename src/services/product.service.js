// ═══════════════════════════════════════════════════════
// Product Service — все запросы для товаров
// ═══════════════════════════════════════════════════════

import { api, apiWithAuth, apiPost, apiPut, apiDelete } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';


class ProductService {

    // ════════════════════════════════════════
    // GET запросы (вызываются из page.js)
    // ════════════════════════════════════════

    /**
     * Все товары продавца (с токеном — Owner/Admin все, Manager своих)
     * GET /api/products/seller/:sellerId
     */
    async getProductsBySeller(sellerId, page = 1, limit = 20) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(
            `/api/products/seller/${sellerId}?page=${page}&limit=${limit}`,
            token
        );
        return json; // { data: [...], pagination: {...} }
    }



    /**
 * Товары по локальной категории
 * GET /api/products/category/:categoryId
 */
    async getProductsByCategory(categoryId, page = 1, limit = 100) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(
            `/api/products/category/${categoryId}?page=${page}&limit=${limit}`,
            token
        );
        return json;
    }

    /**
     * Товар по ID (с токеном)
     * GET /api/products/:id
     */
    async getProductById(id) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/products/${id}`, token);
        return json.data;
    }

    /**
     * Товар по slug внутри продавца (с токеном)
     * GET /api/products/seller/:sellerId/slug/:slug
     */
    async getProductBySlug(sellerId, slug) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(
            `/api/products/seller/${sellerId}/slug/${slug}`,
            token
        );
        return json.data;
    }

    // ════════════════════════════════════════
    // Мутации (вызываются из Server Actions)
    // ════════════════════════════════════════

    /**
     * Создать товар
     * POST /api/products
     * @param {string} token
     * @param {object} body — { name, seller, category?, price?, description?, code?, isAvailable? }
     */
    async createProduct(token, body) {
        const json = await apiPost('/api/products', token, body);
        return json.data;
    }

    /**
     * Обновить товар
     * PUT /api/products/:id
     */
    async updateProduct(token, id, body) {
        const json = await apiPut(`/api/products/${id}`, token, body);
        return json.data;
    }

    /**
     * Удалить товар
     * DELETE /api/products/:id
     */
    async deleteProduct(token, id) {
        const json = await apiDelete(`/api/products/${id}`, token);
        return json.data;
    }

    // ════════════════════════════════════════
    // ИЗОБРАЖЕНИЯ ТОВАРА
    // ════════════════════════════════════════

    /**
     * Загрузить изображение товара (первая загрузка, image === null)
     * POST /api/products/:id/image
     */
    async uploadProductImage(token, id, formData) {
        const API_URL = process.env.API_URL || 'http://localhost:7000';
        const res = await fetch(`${API_URL}/api/products/${id}/image`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData, // FormData с файлом — НЕ JSON!
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка загрузки изображения');
        }
        const json = await res.json();
        return json.data;
    }

    /**
     * Заменить изображение товара (image уже есть)
     * PUT /api/products/:id/image
     */
    async replaceProductImage(token, id, formData) {
        const API_URL = process.env.API_URL || 'http://localhost:7000';
        const res = await fetch(`${API_URL}/api/products/${id}/image`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка замены изображения');
        }
        const json = await res.json();
        return json.data;
    }

    /**
     * Удалить изображение товара
     * DELETE /api/products/:id/image
     */
    async deleteProductImage(token, id) {
        const json = await apiDelete(`/api/products/${id}/image`, token);
        return json.data;
    }

    async getPublicProductsBySeller(sellerId, page = 1, limit = 20, query = '', category = '') {
        const params = new URLSearchParams({ page, limit });
        if (query) params.set('query', query);
        if (category) params.set('category', category);
        const json = await api(`/api/products/seller/${sellerId}?${params}`);
        return json;
    }
}



export default new ProductService();