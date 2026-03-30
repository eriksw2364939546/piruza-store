// src/app/admins-piruza/admin-panel/admins/page.js

import AdminAdminsPage from '@/modules/PrivatePages/AdminPages/AdminAdminsPage/AdminAdminsPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const statusFilter = params?.status || '';

    let allAdmins = [];
    let admins = [];
    let sellersByAdmin = {};

    try {
        const result = await AuthService.getAllUsers('admin');
        allAdmins = result.data || [];

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

    return (
        <AdminAdminsPage
            admins={admins}
            sellersByAdmin={sellersByAdmin}
        />
    );
}