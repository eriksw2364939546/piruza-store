// ═══════════════════════════════════════════════════════
// Dashboard Service — GET запросы для дашборда
// ═══════════════════════════════════════════════════════

import { apiWithAuth } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class DashboardService {

    /**
     * Общая статистика
     * Owner → вся система
     * Admin → только с активными городами/категориями
     * Manager → только свои
     *
     * @returns {Promise<{ sellers: object, requests: object }>}
     * @example
     * const overview = await DashboardService.getOverview();
     */
    async getOverview() {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth('/api/dashboard/overview', token);
        return json.data;
    }

    /**
     * Статистика по всем менеджерам
     * Только Owner и Admin
     *
     * @returns {Promise<Array>}
     * @example
     * const managers = await DashboardService.getManagersStats();
     */
    async getManagersStats() {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth('/api/dashboard/managers', token);
        return json.data;
    }

    /**
     * Продавцы сгруппированные по статусам
     * Owner → все продавцы
     * Admin/Manager → только доступные
     *
     * @returns {Promise<{ draft: Array, active: Array, expired: Array, inactive: Array }>}
     * @example
     * const sellers = await DashboardService.getSellersByStatus();
     */
    async getSellersByStatus() {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth('/api/dashboard/sellers-by-status', token);
        return json.data;
    }
}

export default new DashboardService();