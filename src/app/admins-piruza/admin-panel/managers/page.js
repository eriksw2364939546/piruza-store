// src/app/admins-piruza/admin-panel/managers/page.js

import AdminManagersPage from '@/modules/PrivatePages/AdminPages/AdminManagersPage/AdminManagersPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const statusFilter = params?.status || '';
    const query = params?.query || '';
    const page = Number(params?.page) || 1;

    let managers = [], sellersByManager = {}, counts = {}, pagination = null;

    try {
        const result = await AuthService.getAllUsers('manager', { page, limit: 20, query, status: statusFilter });
        managers = result.data || [];
        pagination = result.pagination || null;
        counts = result.counts || {};

        if (managers.length > 0) {
            const results = await Promise.allSettled(
                managers.map(m => SellerService.getSellersByManager(m._id))
            );
            results.forEach((result, idx) => {
                sellersByManager[managers[idx]._id] = result.status === 'fulfilled'
                    ? (result.value || [])
                    : [];
            });
        }
    } catch {
        managers = [];
    }

    return (
        <AdminManagersPage
            managers={managers}
            pagination={pagination}
            sellersByManager={sellersByManager}
            initialStatus={statusFilter}
            initialQuery={query}
            counts={counts}
        />
    );
}