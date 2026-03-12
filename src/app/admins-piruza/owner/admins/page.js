// src/app/admins-piruza/owner/admins/page.js

import AdminsPage from '@/modules/PrivatePages/OwnerPages/AdminsPage/AdminsPage';
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
        <AdminsPage
            admins={admins}
            sellersByAdmin={sellersByAdmin}
        />
    );
}