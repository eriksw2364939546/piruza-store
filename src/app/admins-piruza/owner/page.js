import DashboardService from '@/services/dashboard.service';
import AuthService from '@/services/auth.service';
import OwnerDashboard from '@/modules/PrivatePages/OwnerDashboard/OwnerDashboard';

const EMPTY_OVERVIEW = {
    sellers: { total: 0, active: 0, draft: 0, expired: 0, inactive: 0 },
    requests: { pending: 0, approved: 0, rejected: 0 },
};

const EMPTY_SELLERS_BY_STATUS = {
    draft: [], active: [], expired: [], inactive: [],
};

async function getSiteMode() {
    try {
        const res = await fetch(
            `${process.env.API_URL}/api/settings/site-mode`,
            { cache: 'no-store' }
        );
        const json = await res.json();
        return json.data?.mode || 'coming_soon';
    } catch {
        return 'coming_soon';
    }
}

const OwnerPage = async () => {
    const [overview, managers, sellersByStatus, allManagers, allAdmins, siteMode] = await Promise.all([
        DashboardService.getOverview().catch(() => EMPTY_OVERVIEW),
        DashboardService.getManagersStats().catch(() => []),
        DashboardService.getSellersByStatus().catch(() => EMPTY_SELLERS_BY_STATUS),
        AuthService.getAllUsers('manager').catch(() => ({ data: [] })),
        AuthService.getAllUsers('admin').catch(() => ({ data: [] })),
        getSiteMode(),
    ]);

    const userStats = {
        managers: allManagers.data?.length ?? 0,
        admins: allAdmins.data?.length ?? 0,
    };

    return (
        <OwnerDashboard
            overview={overview}
            managers={managers}
            sellersByStatus={sellersByStatus}
            userStats={userStats}
            siteMode={siteMode}
        />
    );
};

export default OwnerPage;