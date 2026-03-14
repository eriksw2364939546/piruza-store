// src/app/admins-piruza/manager/sellers/page.js

import ManagerSellersPage from '@/modules/PrivatePages/ManagerPages/ManagerSellersPage/ManagerSellersPage';
import SellerService from '@/services/seller.service';
import RequestService from '@/services/request.service';

export default async function Page() {
    let sellers = [];
    let requests = [];

    try {
        // getAllSellers с токеном менеджера — бэкенд фильтрует автоматически
        const result = await SellerService.getAllSellers({ limit: 100 });
        sellers = result?.data || [];
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