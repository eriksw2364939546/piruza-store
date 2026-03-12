// src/app/admins-piruza/owner/managers/page.js

import ManagersPage from '@/modules/PrivatePages/OwnerPages/ManagersPage/ManagersPage';
import AuthService from '@/services/auth.service';
import SellerService from '@/services/seller.service';

export default async function Page() {
    let managers = [];
    let sellersByManager = {};

    try {
        managers = await AuthService.getAllUsers('manager');

        if (managers.length > 0) {
            const results = await Promise.allSettled(
                managers.map(m => SellerService.getSellersByManager(m._id))
            );

            results.forEach((result, idx) => {
                const managerId = managers[idx]._id;
                sellersByManager[managerId] = result.status === 'fulfilled'
                    ? (result.value || [])
                    : [];
            });
        }
    } catch {
        managers = [];
    }

    return (
        <ManagersPage
            managers={managers}
            sellersByManager={sellersByManager}
        />
    );
}