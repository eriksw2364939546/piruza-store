// src/app/admins-piruza/owner/admins/page.js

import AdminsPage from '@/modules/PrivatePages/OwnerPages/AdminsPage/AdminsPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const statusFilter = params?.status || '';

    let admins = [], sellersByAdmin = {}, counts = {};

    try {
        const result = await AuthService.getAllUsers('admin', { status: statusFilter, limit: 100 });
        admins = result.data || [];
        counts = result.counts || {};

        if (admins.length > 0) {
            const results = await Promise.allSettled(
                admins.map(a => SellerService.getSellersByManager(a._id))
            );
            results.forEach((result, idx) => {
                sellersByAdmin[admins[idx]._id] = result.status === 'fulfilled'
                    ? (result.value || [])
                    : [];
            });
        }
    } catch {
        admins = [];
    }

    return (
        <AdminsPage
            admins={admins}
            sellersByAdmin={sellersByAdmin}
            initialStatus={statusFilter}
            counts={counts}
        />
    );
}