// src/app/admins-piruza/admin-panel/admins/page.js

import AdminAdminsPage from '@/modules/PrivatePages/AdminPages/AdminAdminsPage/AdminAdminsPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page() {
    let admins = [];
    let sellersByAdmin = {};

    try {
        admins = await AuthService.getAllUsers('admin');

        if (admins.length > 0) {
            const results = await Promise.allSettled(
                admins.map(a => SellerService.getSellersByManager(a._id))
            );

            results.forEach((result, idx) => {
                const adminId = admins[idx]._id;
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