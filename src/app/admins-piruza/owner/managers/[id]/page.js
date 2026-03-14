// src/app/admins-piruza/owner/managers/[id]/page.js

import { notFound } from 'next/navigation';
import ManagerDetailPage from '@/modules/PrivatePages/OwnerPages/ManagersPage/ManagerDetailPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ params, searchParams }) {
    const { id } = await params;
    const sp = await searchParams;
    const statusFilter = sp?.status || '';

    let manager = null;
    let sellers = [];

    try {
        manager = await AuthService.getUserById(id);
    } catch {
        notFound();
    }

    try {
        const result = await SellerService.getSellersByManager(manager._id, 1, 100);
        sellers = Array.isArray(result) ? result : (result?.data || []);
    } catch {
        sellers = [];
    }

    const filteredSellers = statusFilter
        ? sellers.filter(s => s.status === statusFilter)
        : sellers;

    const counts = {
        all: sellers.length,
        active: sellers.filter(s => s.status === 'active').length,
        draft: sellers.filter(s => s.status === 'draft').length,
        expired: sellers.filter(s => s.status === 'expired').length,
        inactive: sellers.filter(s => s.status === 'inactive').length,
    };

    return (
        <ManagerDetailPage
            manager={manager}
            sellers={filteredSellers}
            counts={counts}
            statusFilter={statusFilter}
            basePath="/admins-piruza/owner/managers"
            sellersBasePath="/admins-piruza/owner/sellers"
        />
    );
}