// ═══════════════════════════════════════════════════════
// Seller Service — все запросы для продавцов
// ═══════════════════════════════════════════════════════

import { api, apiWithAuth, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class SellerService {

    // ════════════════════════════════════════
    // GET запросы (вызываются из page.js)
    // ════════════════════════════════════════

    /**
     * Все продавцы (Owner все, Admin фильтрованные, Manager свои)
     * GET /api/sellers
     */
    async getAllSellers({ query, status, city, category, page = 1, limit = 20 } = {}) {
        const token = await getTokenOrRedirect();
        const params = new URLSearchParams({ page, limit });
        if (query) params.set('query', query);
        if (status) params.set('status', status);
        if (city) params.set('city', city);
        if (category) params.set('category', category);
        const json = await apiWithAuth(`/api/sellers?${params}`, token);
        return json;
    }

    /**
     * Продавцы конкретного Manager'а (Owner/Admin)
     * GET /api/sellers/manager/:managerId
     */
    async getSellersByManager(managerId, page = 1, limit = 20) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/sellers/manager/${managerId}?page=${page}&limit=${limit}`, token);
        return json.data || [];
    }

    /**
     * Продавец по ID (с токеном)
     * GET /api/sellers/:id
     */
    async getSellerById(id) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/sellers/${id}`, token);
        return json.data;
    }

    /**
     * Продавец по slug (с токеном — Owner/Admin все, Manager своих)
     * GET /api/sellers/slug/:slug
     */
    async getSellerBySlug(slug) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/sellers/slug/${slug}`, token);
        return json.data;
    }

    /**
     * Универсальный публичный (по slug города и категории)
     * GET /api/sellers/public?city=slug&category=slug
     */
    async getPublicSellers({ city, category, page = 1, limit = 20 } = {}) {
        const params = new URLSearchParams({ page, limit });
        if (city) params.set('city', city);
        if (category) params.set('category', category);
        const json = await api(`/api/sellers/public?${params}`);
        return json;
    }

    /**
     * Все активные продавцы (публично)
     * GET /api/sellers/public/active
     */
    async getActiveSellers({ category, page = 1, limit = 20 } = {}) {
        const params = new URLSearchParams({ page, limit });
        if (category) params.set('category', category);
        const json = await api(`/api/sellers/public/active?${params}`);
        return json;
    }

    /**
     * Публичные продавцы по ID города
     * GET /api/sellers/public/city/:cityId
     */
    async getSellersByCity(cityId, { category, page = 1, limit = 20 } = {}) {
        const params = new URLSearchParams({ page, limit });
        if (category) params.set('category', category);
        const json = await api(`/api/sellers/public/city/${cityId}?${params}`);
        return json;
    }

    /**
     * Публичные продавцы по slug города
     * GET /api/sellers/public/city-slug/:slug
     */
    async getSellersByCitySlug(slug, { category, page = 1, limit = 20 } = {}) {
        const params = new URLSearchParams({ page, limit });
        if (category) params.set('category', category);
        const json = await api(`/api/sellers/public/city-slug/${slug}?${params}`);
        return json;
    }

    // ════════════════════════════════════════
    // Мутации (вызываются из Server Actions)
    // ════════════════════════════════════════

    /**
     * Создать продавца (после одобрения заявки)
     * POST /api/sellers
     */
    async createSeller(token, body) {
        const json = await apiPost('/api/sellers', token, body);
        return json.data;
    }

    /**
     * Обновить продавца
     * PUT /api/sellers/:id
     */
    async updateSeller(token, id, body) {
        const json = await apiPut(`/api/sellers/${id}`, token, body);
        return json.data;
    }

    /**
     * Обновить глобальные категории продавца
     * PATCH /api/sellers/:id/categories
     */
    async updateSellerCategories(token, id, globalCategories) {
        const json = await apiPatch(`/api/sellers/${id}/categories`, token, { globalCategories });
        return json.data;
    }

    // ════════════════════════════════════════
    // ЛОГОТИП (logo)
    // ════════════════════════════════════════

    /**
     * Загрузить лого (первая загрузка, logo === null)
     * POST /api/sellers/:id/logo
     * @param {string} token
     * @param {string} id  — MongoDB _id продавца
     * @param {FormData} formData — поле "image"
     */
    async uploadSellerLogo(token, id, formData) {
        const API_URL = process.env.API_URL || 'http://localhost:7000';
        const res = await fetch(`${API_URL}/api/sellers/${id}/logo`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData, // FormData с файлом — НЕ JSON!
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка загрузки лого');
        }
        const json = await res.json();
        return json.data;
    }

    /**
     * Заменить лого (logo уже есть)
     * PUT /api/sellers/:id/logo
     */
    async replaceSellerLogo(token, id, formData) {
        const API_URL = process.env.API_URL || 'http://localhost:7000';
        const res = await fetch(`${API_URL}/api/sellers/${id}/logo`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка замены лого');
        }
        const json = await res.json();
        return json.data;
    }

    /**
     * Удалить лого
     * DELETE /api/sellers/:id/logo
     */
    async deleteSellerLogo(token, id) {
        const json = await apiDelete(`/api/sellers/${id}/logo`, token);
        return json.data;
    }

    // ════════════════════════════════════════
    // ОБЛОЖКА (cover)
    // ════════════════════════════════════════

    /**
     * Загрузить обложку (первая загрузка, cover === null)
     * POST /api/sellers/:id/cover
     */
    async uploadSellerCover(token, id, formData) {
        const API_URL = process.env.API_URL || 'http://localhost:7000';
        const res = await fetch(`${API_URL}/api/sellers/${id}/cover`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка загрузки обложки');
        }
        const json = await res.json();
        return json.data;
    }

    /**
     * Заменить обложку (cover уже есть)
     * PUT /api/sellers/:id/cover
     */
    async replaceSellerCover(token, id, formData) {
        const API_URL = process.env.API_URL || 'http://localhost:7000';
        const res = await fetch(`${API_URL}/api/sellers/${id}/cover`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Ошибка замены обложки');
        }
        const json = await res.json();
        return json.data;
    }

    /**
     * Удалить обложку
     * DELETE /api/sellers/:id/cover
     */
    async deleteSellerCover(token, id) {
        const json = await apiDelete(`/api/sellers/${id}/cover`, token);
        return json.data;
    }

    /**
     * Активировать продавца (Owner/Admin — устанавливает даты)
     * POST /api/sellers/:id/activate
     */
    async activateSeller(token, id, months) {
        const body = months ? { months } : {};
        const json = await apiPost(`/api/sellers/${id}/activate`, token, body);
        return json.data;
    }

    /**
     * Активировать продавца (Manager — БЕЗ изменения дат)
     * POST /api/sellers/:id/activate-manager
     */
    async activateSellerManager(token, id) {
        const json = await apiPost(`/api/sellers/${id}/activate-manager`, token, {});
        return json.data;
    }

    /**
     * Продлить продавца (Owner/Admin)
     * POST /api/sellers/:id/extend
     */
    async extendSeller(token, id, months) {
        const json = await apiPost(`/api/sellers/${id}/extend`, token, { months });
        return json.data;
    }

    /**
     * Деактивировать продавца вручную (Owner/Admin)
     * POST /api/sellers/:id/deactivate
     */
    async deactivateSeller(token, id) {
        const json = await apiPost(`/api/sellers/${id}/deactivate`, token, {});
        return json.data;
    }

    /**
     * Перевести в draft (Owner/Admin/Manager своих)
     * POST /api/sellers/:id/draft
     */
    async moveToDraft(token, id) {
        const json = await apiPost(`/api/sellers/${id}/draft`, token, {});
        return json.data;
    }

    /**
     * Удалить продавца и все связанные данные
     * DELETE /api/sellers/:id
     */
    async deleteSeller(token, id) {
        const json = await apiDelete(`/api/sellers/${id}`, token);
        return json.data;
    }
}

export default new SellerService();