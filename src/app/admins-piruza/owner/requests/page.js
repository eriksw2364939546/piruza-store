// src/app/admins-piruza/owner/requests/page.js

import RequestsPage from '@/modules/PrivatePages/OwnerPages/RequestsPage/RequestsPage';
import RequestService from '@/services/request.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const status = params?.status || '';

    let requests = [];
    let pagination = null;

    try {
        const res = await RequestService.getAllRequests({ status, limit: 50 });
        requests = res.data || [];
        pagination = res.pagination || null;
    } catch {
        requests = [];
    }

    return (
        <RequestsPage
            requests={requests}
            pagination={pagination}
            initialStatus={status}
        />
    );
}