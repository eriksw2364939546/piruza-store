// src/app/admins-piruza/manager/page.js

import SellerService from '@/services/seller.service';
import RequestService from '@/services/request.service';
import ManagerDashboard from '@/modules/PrivatePages/ManagerDashboard/ManagerDashboard';

export default async function ManagerPage() {

    let sellers = [];
    let requests = [];

    const [sellersResult, requestsResult] = await Promise.allSettled([
        SellerService.getAllSellers({ limit: 100 }),
        RequestService.getMyRequests({ limit: 100 }),
    ]);

    if (sellersResult.status === 'fulfilled') {
        sellers = sellersResult.value?.data || [];
    }

    if (requestsResult.status === 'fulfilled') {
        requests = requestsResult.value?.data || [];
    }

    // Считаем статистику на сервере
    const overview = {
        sellers: {
            total: sellers.length,
            active: sellers.filter(s => s.status === 'active').length,
            draft: sellers.filter(s => s.status === 'draft').length,
            expired: sellers.filter(s => s.status === 'expired').length,
            inactive: sellers.filter(s => s.status === 'inactive').length,
        },
        requests: {
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length,
        },
    };

    const sellersByStatus = {
        active: sellers.filter(s => s.status === 'active'),
        draft: sellers.filter(s => s.status === 'draft'),
        expired: sellers.filter(s => s.status === 'expired'),
        inactive: sellers.filter(s => s.status === 'inactive'),
    };

    return (
        <ManagerDashboard
            overview={overview}
            sellersByStatus={sellersByStatus}
        />
    );
}