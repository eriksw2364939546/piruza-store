// src/app/admins-piruza/manager/sellers/page.js

import ManagerSellersPage from '@/modules/PrivatePages/ManagerPages/ManagerSellersPage/ManagerSellersPage';
import SellerService from '@/services/seller.service';
import RequestService from '@/services/request.service';
import AuthService from '@/services/auth.service';

export default async function Page() {
    let sellers = [];
    let requests = [];

    try {
        const profile = await AuthService.getProfile();
        sellers = await SellerService.getSellersByManager(profile._id) || [];
    } catch {
        sellers = [];
    }

    try {
        const result = await RequestService.getMyRequests({ limit: 5 });
        requests = result?.data || [];
    } catch {
        requests = [];
    }

    return (
        <ManagerSellersPage
            sellers={sellers}
            requests={requests}
        />
    );
}