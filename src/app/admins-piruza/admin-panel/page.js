// ═══════════════════════════════════════════════════════
// Admin Dashboard Page — серверный компонент
// ═══════════════════════════════════════════════════════

import DashboardService from '@/services/dashboard.service';
import AuthService from '@/services/auth.service';
import AdminDashboard from '@/modules/PrivatePages/AdminDashboard/AdminDashboard';

const EMPTY_OVERVIEW = {
    sellers: { total: 0, active: 0, draft: 0, expired: 0, inactive: 0 },
    requests: { pending: 0, approved: 0, rejected: 0 },
};

const EMPTY_SELLERS_BY_STATUS = {
    draft: [], active: [], expired: [], inactive: [],
};

const AdminPage = async () => {

    const [overview, managers, sellersByStatus, allManagers, allAdmins] = await Promise.all([
        DashboardService.getOverview().catch(() => EMPTY_OVERVIEW),
        DashboardService.getManagersStats().catch(() => []),
        DashboardService.getSellersByStatus().catch(() => EMPTY_SELLERS_BY_STATUS),
        AuthService.getAllUsers('manager').catch(() => []),
        AuthService.getAllUsers('admin').catch(() => []),
    ]);

    const userStats = {
        managers: allManagers.length,
        admins: allAdmins.length,
    };

    return (
        <AdminDashboard
            overview={overview}
            managers={managers}
            sellersByStatus={sellersByStatus}
            userStats={userStats}
        />
    );
};

export default AdminPage;