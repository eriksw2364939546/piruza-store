// src/app/admins-piruza/manager/requests/page.js

import ManagerRequestsPage from '@/modules/PrivatePages/ManagerPages/ManagerRequestsPage/ManagerRequestsPage';
import RequestService from '@/services/request.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const status = params?.status || '';
    const page = Number(params?.page) || 1;

    let requests = [], counts = {}, pagination = null;

    try {
        const result = await RequestService.getMyRequests({ status, page, limit: 20 });
        requests = result?.data || [];
        pagination = result?.pagination || null;
        counts = result?.counts || {};
    } catch {
        requests = [];
    }

    return (
        <ManagerRequestsPage
            requests={requests}
            pagination={pagination}
            counts={counts}
            initialStatus={status}
        />
    );
}