// src/app/admins-piruza/owner/admins/[id]/page.js

import { notFound } from 'next/navigation';
import AdminDetailPage from '@/modules/PrivatePages/OwnerPages/AdminsPage/AdminDetailPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ params, searchParams }) {
    const { id } = await params;
    const sp = await searchParams;
    const statusFilter = sp?.status || '';

    let admin = null;
    let sellers = [];

    try {
        admin = await AuthService.getUserById(id);
    } catch {
        notFound();
    }

    try {
        const result = await SellerService.getSellersByManager(admin._id, 1, 100);
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
        <AdminDetailPage
            manager={admin}
            sellers={filteredSellers}
            counts={counts}
            statusFilter={statusFilter}
            basePath="/admins-piruza/owner/admins"
            sellersBasePath="/admins-piruza/owner/sellers"
        />
    );
}