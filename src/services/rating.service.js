// ═══════════════════════════════════════════════════════
// Rating Service — запросы к /api/ratings/*
// ═══════════════════════════════════════════════════════

import { apiWithAuth } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class RatingService {

    /**
     * Рейтинг продавца (средний + кол-во)
     * GET /api/ratings/seller/:sellerId
     */
    async getSellerRating(sellerId) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/ratings/seller/${sellerId}`, token);
        return json.data;
    }

    /**
     * Статистика по звёздам (1-5)
     * GET /api/ratings/seller/:sellerId/stats
     */
    async getSellerRatingStats(sellerId) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/ratings/seller/${sellerId}/stats`, token);
        return json.data;
    }

    /**
     * Список всех оценок продавца с клиентами
     * GET /api/ratings/seller/:sellerId/list?page=1&limit=20&rating=5
     */
    async getSellerRatingList(sellerId, { page = 1, limit = 20, rating = '', query = '' } = {}) {
        const token = await getTokenOrRedirect();
        const params = new URLSearchParams({ page, limit });
        if (rating) params.set('rating', rating);
        if (query) params.set('query', query);
        const json = await apiWithAuth(
            `/api/ratings/seller/${sellerId}/list?${params}`,
            token
        );
        return json; // { data, pagination }
    }
}

export default new RatingService();