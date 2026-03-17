// src/app/admins-piruza/owner/managers/page.js

import ManagersPage from '@/modules/PrivatePages/OwnerPages/ManagersPage/ManagersPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const statusFilter = params?.status || '';
    const query = params?.query || '';

    let managers = [];
    let sellersByManager = {};

    try {
        const all = await AuthService.getAllUsers('manager');

        // Фильтрация по статусу и поиску по имени
        managers = all.filter(m => {
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

        if (all.length > 0) {
            const results = await Promise.allSettled(
                all.map(m => SellerService.getSellersByManager(m._id))
            );
            results.forEach((result, idx) => {
                const managerId = all[idx]._id;
                sellersByManager[managerId] = result.status === 'fulfilled'
                    ? (result.value || [])
                    : [];
            });
        }
    } catch {
        managers = [];
    }

    const counts = {
        all: managers.length,
        active: managers.filter(m => m.isActive).length,
        inactive: managers.filter(m => !m.isActive).length,
    };

    return (
        <ManagersPage
            managers={managers}
            sellersByManager={sellersByManager}
            initialStatus={statusFilter}
            initialQuery={query}
            counts={counts}
        />
    );
}