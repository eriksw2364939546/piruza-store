// ═══════════════════════════════════════════════════════
// Client Service — запросы к /api/clients/*
// Только для Owner
// ═══════════════════════════════════════════════════════

import { apiWithAuth } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class ClientService {

    // GET /api/clients?page=1&limit=20&query=&isActive=
    async getAllClients({ page = 1, limit = 20, query = '', isActive = '' } = {}) {
        const token = await getTokenOrRedirect();
        const params = new URLSearchParams({ page, limit });
        if (query) params.set('query', query);
        if (isActive !== '') params.set('isActive', isActive);
        const json = await apiWithAuth(`/api/clients?${params}`, token);
        return json; // { data, pagination }
    }

    // GET /api/clients/:id
    async getClientById(id) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/clients/${id}`, token);
        return json.data;
    }

    // GET /api/clients/:id/ratings?page=1&limit=20&rating=
    async getClientRatings(id, { page = 1, limit = 20, rating = '' } = {}) {
        const token = await getTokenOrRedirect();
        const params = new URLSearchParams({ page, limit });
        if (rating) params.set('rating', rating);
        const json = await apiWithAuth(`/api/clients/${id}/ratings?${params}`, token);
        return json; // { data, pagination }
    }

    // PATCH /api/clients/:id/toggle-active
    async toggleClientActive(id) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/clients/${id}/toggle-active`, token, {
            method: 'PATCH',
        });
        return json.data;
    }
}

export default new ClientService();