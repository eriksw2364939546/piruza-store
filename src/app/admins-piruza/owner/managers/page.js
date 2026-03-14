// src/app/admins-piruza/owner/managers/page.js

import ManagersPage from '@/modules/PrivatePages/OwnerPages/ManagersPage/ManagersPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const statusFilter = params?.status || ''; // 'active' | 'inactive' | ''

    let managers = [];
    let sellersByManager = {};

    try {
        const all = await AuthService.getAllUsers('manager');

        // Фильтрация по статусу если задан
        managers = statusFilter
            ? all.filter(m => {
                if (statusFilter === 'active') return m.isActive === true;
                if (statusFilter === 'inactive') return m.isActive === false;
                return true;
            })
            : all;

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
            counts={counts}
        />
    );
}