// ═══════════════════════════════════════════════════════
// Manager Service — запросы для менеджеров
// ═══════════════════════════════════════════════════════

import { apiWithAuth, apiPost, apiPut, apiDelete } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class ManagerService {

    /**
     * Список менеджеров
     * GET /api/auth/users?role=manager
     */
    async getAllManagers() {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth('/api/auth/users?role=manager', token);
        return json.data || [];
    }

    /**
     * Менеджер по ID
     * GET /api/auth/users/:id
     */
    async getManagerById(id) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/auth/users/${id}`, token);
        return json.data;
    }

    /**
     * Продавцы менеджера
     * GET /api/sellers/manager/:managerId
     */
    async getSellersByManager(managerId) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/sellers/manager/${managerId}`, token);
        return json.data || [];
    }

    /**
     * Создать менеджера (Owner only)
     * POST /api/auth/register
     */
    async createManager(token, body) {
        const json = await apiPost('/api/auth/register', token, { ...body, role: 'manager' });
        return json.data;
    }

    /**
     * Обновить менеджера (Owner only)
     * PUT /api/auth/users/:id
     */
    async updateManager(token, id, body) {
        const json = await apiPut(`/api/auth/users/${id}`, token, body);
        return json.data;
    }

    /**
     * Удалить менеджера (Owner only)
     * DELETE /api/auth/users/:id
     */
    async deleteManager(token, id) {
        const json = await apiDelete(`/api/auth/users/${id}`, token);
        return json.data;
    }
}

export default new ManagerService();