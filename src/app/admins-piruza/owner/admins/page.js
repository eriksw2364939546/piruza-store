// src/app/admins-piruza/owner/admins/page.js

import AdminsPage from '@/modules/PrivatePages/OwnerPages/AdminsPage/AdminsPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const statusFilter = params?.status || '';

    let allAdmins = [];
    let admins = [];
    let sellersByAdmin = {};

    try {
        allAdmins = await AuthService.getAllUsers('admin');

        admins = statusFilter
            ? allAdmins.filter(a => {
                if (statusFilter === 'active') return a.isActive === true;
                if (statusFilter === 'inactive') return a.isActive === false;
                return true;
            })
            : allAdmins;

        if (allAdmins.length > 0) {
            const results = await Promise.allSettled(
                allAdmins.map(a => SellerService.getSellersByManager(a._id))
            );
            results.forEach((result, idx) => {
                const adminId = allAdmins[idx]._id;
                sellersByAdmin[adminId] = result.status === 'fulfilled'
                    ? (result.value || [])
                    : [];
            });
        }
    } catch {
        admins = [];
    }

    const counts = {
        all: allAdmins.length,
        active: allAdmins.filter(a => a.isActive).length,
        inactive: allAdmins.filter(a => !a.isActive).length,
    };

    return (
        <AdminsPage
            admins={admins}
            sellersByAdmin={sellersByAdmin}
            initialStatus={statusFilter}
            counts={counts}
        />
    );
}