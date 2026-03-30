// src/app/admins-piruza/owner/managers/[id]/page.js

import { notFound } from 'next/navigation';
import ManagerDetailPage from '@/modules/PrivatePages/OwnerPages/ManagersPage/ManagerDetailPage';
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
        const result = await SellerService.getSellersByManager(manager._id, page, 10, query, statusFilter);
        sellers = result.data || [];
        pagination = result.pagination || null;
        counts = result.counts || {};
    } catch {
        sellers = [];
    }

    return (
        <ManagerDetailPage
            manager={manager}
            sellers={sellers}
            pagination={pagination}
            counts={counts}
            statusFilter={statusFilter}
            initialQuery={query}
            basePath="/admins-piruza/owner/managers"
            sellersBasePath="/admins-piruza/owner/sellers"
        />
    );
}