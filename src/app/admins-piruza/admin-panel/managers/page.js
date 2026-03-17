// src/app/admins-piruza/admin-panel/managers/page.js

import AdminManagersPage from '@/modules/PrivatePages/AdminPages/AdminManagersPage/AdminManagersPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const statusFilter = params?.status || '';
    const query = params?.query || '';

    let allManagers = [];
    let managers = [];
    let sellersByManager = {};

    try {
        allManagers = await AuthService.getAllUsers('manager');

        managers = allManagers.filter(m => {
            const matchStatus =
                !statusFilter ||
                (statusFilter === 'active' && m.isActive === true) ||
                (statusFilter === 'inactive' && m.isActive === false);
            const matchQuery =
                !query ||
                m.name?.toLowerCase().includes(query.toLowerCase()) ||
                m.email?.toLowerCase().includes(query.toLowerCase());
            return matchStatus && matchQuery;
        });

        if (allManagers.length > 0) {
            const results = await Promise.allSettled(
                allManagers.map(m => SellerService.getSellersByManager(m._id))
            );
            results.forEach((result, idx) => {
                const managerId = allManagers[idx]._id;
                sellersByManager[managerId] = result.status === 'fulfilled'
                    ? (result.value || [])
                    : [];
            });
        }
    } catch {
        managers = [];
    }

    const counts = {
        all: allManagers.length,
        active: allManagers.filter(m => m.isActive).length,
        inactive: allManagers.filter(m => !m.isActive).length,
    };

    return (
        <AdminManagersPage
            managers={managers}
            sellersByManager={sellersByManager}
            initialStatus={statusFilter}
            counts={counts}
        />
    );
}