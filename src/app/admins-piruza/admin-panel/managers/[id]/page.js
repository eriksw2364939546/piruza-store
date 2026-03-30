// src/app/admins-piruza/admin-panel/managers/[id]/page.js

import { notFound } from 'next/navigation';
import AdminManagerDetailPage from '@/modules/PrivatePages/AdminPages/AdminManagersPage/AdminManagerDetailPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ params, searchParams }) {
    const { id } = await params;
    const sp = await searchParams;
    const statusFilter = sp?.status || '';
    const query = sp?.query || '';
    const page = Number(sp?.page) || 1;

    let manager = null;
    try {
        manager = await AuthService.getUserById(id);
    } catch {
        notFound();
    }

    let sellers = [], pagination = null, counts = {};

    try {
        const allResult = await SellerService.getSellersByManager(manager._id, 1, 1000);
        const all = allResult.data || [];
        counts = {
            all: all.length,
            active: all.filter(s => s.status === 'active').length,
            draft: all.filter(s => s.status === 'draft').length,
            expired: all.filter(s => s.status === 'expired').length,
            inactive: all.filter(s => s.status === 'inactive').length,
        };

        const result = await SellerService.getSellersByManager(manager._id, page, 20, query, statusFilter);
        sellers = result.data || [];
        pagination = result.pagination || null;
    } catch {
        sellers = [];
    }

    return (
        <AdminManagerDetailPage
            manager={manager}
            sellers={sellers}
            pagination={pagination}
            counts={counts}
            statusFilter={statusFilter}
            initialQuery={query}
            basePath="/admins-piruza/admin-panel/managers"
            sellersBasePath="/admins-piruza/admin-panel/sellers"
        />
    );
}