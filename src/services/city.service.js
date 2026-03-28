// ═══════════════════════════════════════════════════════
// City Service — все запросы для городов
// ═══════════════════════════════════════════════════════

import { api, apiWithAuth, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class CityService {

    // ─── GET запросы (вызываются из page.js) ───

    /**
     * Все города включая неактивные
     * Owner only
     * GET /api/cities
     */
    async getAllCities(page = 1, limit = 20, query = '', status = '') {
        const token = await getTokenOrRedirect();
        const params = new URLSearchParams({ page, limit });
        if (query) params.set('query', query);
        if (status) params.set('status', status);
        const json = await apiWithAuth(`/api/cities?${params}`, token);
        return json;
    }

    /**
     * Только активные города (публично, без токена)
     * GET /api/cities/active
     */
    async getActiveCities(page = 1, limit = 20) {
        const json = await api(`/api/cities/active?page=${page}&limit=${limit}`);
        return json;
    }

    /**
     * Город по slug (публично — только активные)
     * GET /api/cities/slug/:slug
     */
    async getCityBySlug(slug) {
        const json = await api(`/api/cities/slug/${slug}`);
        return json.data;
    }

    /**
     * Город по slug (Owner — включая неактивные)
     * GET /api/cities/admin/slug/:slug
     */
    async getCityBySlugAdmin(slug) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/cities/admin/slug/${slug}`, token);
        return json.data;
    }

    // ─── Мутации (вызываются из Server Actions) ───

    /**
     * Создать город
     * POST /api/cities
     */
    async createCity(token, body) {
        const json = await apiPost('/api/cities', token, body);
        return json.data;
    }

    /**
     * Обновить город
     * PUT /api/cities/:id
     */
    async updateCity(token, id, body) {
        const json = await apiPut(`/api/cities/${id}`, token, body);
        return json.data;
    }

    /**
     * Переключить статус города
     * PATCH /api/cities/:id/toggle
     */
    async toggleStatus(token, id) {
        const json = await apiPatch(`/api/cities/${id}/toggle`, token, {});
        return json.data;
    }

    /**
     * Удалить город
     * DELETE /api/cities/:id
     */
    async deleteCity(token, id) {
        const json = await apiDelete(`/api/cities/${id}`, token);
        return json.data;
    }
}

export default new CityService();