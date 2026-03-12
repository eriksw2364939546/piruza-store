// ═══════════════════════════════════════════════════════
// Request Service — все запросы для заявок
// ═══════════════════════════════════════════════════════

import { apiWithAuth, apiPost } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class RequestService {

    // ════════════════════════════════════════
    // GET (вызываются из page.js)
    // ════════════════════════════════════════

    /**
     * Все заявки (Owner/Admin)
     * GET /api/requests?status=&managerId=&page=&limit=
     */
    async getAllRequests({ status, managerId, page = 1, limit = 20 } = {}) {
        const token = await getTokenOrRedirect();
        const params = new URLSearchParams({ page, limit });
        if (status) params.set('status', status);
        if (managerId) params.set('managerId', managerId);
        const json = await apiWithAuth(`/api/requests?${params}`, token);
        return json; // { data: [...], pagination: {...} }
    }

    /**
     * Свои заявки (Manager)
     * GET /api/requests/my
     */
    async getMyRequests({ status, page = 1, limit = 20 } = {}) {
        const token = await getTokenOrRedirect();
        const params = new URLSearchParams({ page, limit });
        if (status) params.set('status', status);
        const json = await apiWithAuth(`/api/requests/my?${params}`, token);
        return json;
    }

    /**
     * Заявка по ID
     * GET /api/requests/:id
     */
    async getRequestById(id) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/requests/${id}`, token);
        return json.data;
    }

    // ════════════════════════════════════════
    // Мутации (вызываются из Server Actions)
    // ════════════════════════════════════════

    /**
     * Создать заявку (Manager)
     * POST /api/requests
     */
    async createRequest(token, body) {
        const json = await apiPost('/api/requests', token, body);
        return json.data;
    }

    /**
     * Одобрить заявку (Owner/Admin)
     * POST /api/requests/:id/approve
     */
    async approveRequest(token, id) {
        const json = await apiPost(`/api/requests/${id}/approve`, token, {});
        return json.data;
    }

    /**
     * Отклонить заявку (Owner/Admin)
     * POST /api/requests/:id/reject
     * @param {string} rejectionReason — обязательное поле
     */
    async rejectRequest(token, id, rejectionReason) {
        const json = await apiPost(`/api/requests/${id}/reject`, token, { rejectionReason });
        return json.data;
    }
}

export default new RequestService();