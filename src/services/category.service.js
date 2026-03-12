// ═══════════════════════════════════════════════════════
// Category Service — все запросы для категорий
// ═══════════════════════════════════════════════════════

import { api, apiWithAuth, apiPost, apiPut, apiDelete } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class CategoryService {

    // ─── GET запросы (вызываются из page.js) ───

    /**
     * Все глобальные категории включая неактивные
     * Owner only
     * GET /api/categories/global/all
     */
    async getAllGlobalCategories(page = 1, limit = 20) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/categories/global/all?page=${page}&limit=${limit}`, token);
        return json;
    }

    /**
     * Только активные глобальные категории (публично)
     * GET /api/categories/global
     */
    async getGlobalCategories(page = 1, limit = 20) {
        const json = await api(`/api/categories/global?page=${page}&limit=${limit}`);
        return json;
    }

    /**
     * Глобальная категория по slug (публично — только активные)
     * GET /api/categories/global/slug/:slug
     */
    async getGlobalCategoryBySlug(slug) {
        const json = await api(`/api/categories/global/slug/${slug}`);
        return json.data;
    }

    /**
     * Глобальная категория по slug (Owner — включая неактивные)
     * GET /api/categories/global/admin/slug/:slug
     */
    async getGlobalCategoryBySlugAdmin(slug) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/categories/global/admin/slug/${slug}`, token);
        return json.data;
    }

    /**
     * Категории продавца
     * Публично: только если продавец active
     * С токеном: Owner/Admin/Manager по правам
     * GET /api/categories/seller/:sellerId
     */
    async getSellerCategories(sellerId, page = 1, limit = 20) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/categories/seller/${sellerId}?page=${page}&limit=${limit}`, token);
        return json;
    }

    /**
     * Категория продавца по slug
     * GET /api/categories/seller/:sellerId/slug/:slug
     */
    async getSellerCategoryBySlug(sellerId, slug) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/categories/seller/${sellerId}/slug/${slug}`, token);
        return json.data;
    }

    // ─── Мутации (вызываются из Server Actions) ───

    /**
     * Создать глобальную категорию
     * Owner only
     * POST /api/categories/global
     */
    async createGlobalCategory(token, body) {
        const json = await apiPost('/api/categories/global', token, {
            ...body,
            isGlobal: true,
        });
        return json.data;
    }

    /**
     * Создать локальную категорию продавца
     * Owner/Admin/Manager (своих)
     * POST /api/categories/seller
     */
    async createSellerCategory(token, body) {
        const json = await apiPost('/api/categories/seller', token, {
            ...body,
            isGlobal: false,
        });
        return json.data;
    }

    /**
     * Обновить категорию (глобальную или локальную)
     * PUT /api/categories/:id
     */
    async updateCategory(token, id, body) {
        const json = await apiPut(`/api/categories/${id}`, token, body);
        return json.data;
    }

    /**
     * Удалить категорию
     * DELETE /api/categories/:id
     */
    async deleteCategory(token, id) {
        const json = await apiDelete(`/api/categories/${id}`, token);
        return json.data;
    }
}

export default new CategoryService();