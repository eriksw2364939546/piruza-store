// src/app/admins-piruza/manager/requests/page.js

import ManagerRequestsPage from '@/modules/PrivatePages/ManagerPages/ManagerRequestsPage/ManagerRequestsPage';
import RequestService from '@/services/request.service';

export default async function Page() {
    let requests = [];

    try {
        const result = await RequestService.getMyRequests({ limit: 50 });
        requests = result?.data || [];
    } catch {
        requests = [];
    }

    return <ManagerRequestsPage requests={requests} />;
}