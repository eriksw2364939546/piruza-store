// ═══════════════════════════════════════════════════════
// Manager Dashboard Page — серверный компонент
// GET запросы через DashboardService
// ═══════════════════════════════════════════════════════

import DashboardService from '@/services/dashboard.service';
import ManagerDashboard from '@/modules/PrivatePages/ManagerDashboard/ManagerDashboard';

const EMPTY_OVERVIEW = {
    sellers: { total: 0, active: 0, draft: 0, expired: 0, inactive: 0 },
    requests: { pending: 0, approved: 0, rejected: 0 },
};

const EMPTY_SELLERS_BY_STATUS = {
    draft: [], active: [], expired: [], inactive: [],
};

const ManagerPage = async () => {

    // Два запроса параллельно — managers не нужен
    const [overview, sellersByStatus] = await Promise.all([
        DashboardService.getOverview().catch(() => EMPTY_OVERVIEW),
        DashboardService.getSellersByStatus().catch(() => EMPTY_SELLERS_BY_STATUS),
    ]);

    return (
        <ManagerDashboard
            overview={overview}
            sellersByStatus={sellersByStatus}
        />
    );
};

export default ManagerPage;