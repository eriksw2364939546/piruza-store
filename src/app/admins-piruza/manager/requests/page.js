// src/app/admins-piruza/manager/requests/page.js

import ManagerRequestsPage from '@/modules/PrivatePages/ManagerPages/ManagerRequestsPage/ManagerRequestsPage';
import RequestService from '@/services/request.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const status = params?.status || '';

    let allRequests = [];

    try {
        const result = await RequestService.getMyRequests({ limit: 50 });
        allRequests = result?.data || [];
    } catch {
        allRequests = [];
    }

    const requests = status
        ? allRequests.filter(r => r.status === status)
        : allRequests;

    const counts = {
        all: allRequests.length,
        pending: allRequests.filter(r => r.status === 'pending').length,
        approved: allRequests.filter(r => r.status === 'approved').length,
        rejected: allRequests.filter(r => r.status === 'rejected').length,
    };

    return (
        <ManagerRequestsPage
            requests={requests}
            counts={counts}
            initialStatus={status}
        />
    );
}