// src/app/admins-piruza/admin-panel/requests/page.js

import AdminRequestsPage from '@/modules/PrivatePages/AdminPages/AdminRequestsPage/AdminRequestsPage';
import RequestService from '@/services/request.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const status = params?.status || '';

    const result = await RequestService.getAllRequests({ status, limit: 50 })
        .catch(() => ({ data: [], pagination: null }));

    return (
        <AdminRequestsPage
            requests={result.data}
            pagination={result.pagination}
            initialStatus={status}
        />
    );
}