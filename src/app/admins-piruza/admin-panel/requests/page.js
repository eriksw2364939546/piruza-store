// src/app/admins-piruza/admin-panel/requests/page.js

import AdminRequestsPage from '@/modules/PrivatePages/AdminPages/AdminRequestsPage/AdminRequestsPage';
import RequestService from '@/services/request.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const status = params?.status || '';

    try {
        const res = await RequestService.getAllRequests({ status, limit: 50 });
        return (
            <AdminRequestsPage
                requests={res.data || []}
                pagination={res.pagination || null}
                counts={res.counts || null}
                initialStatus={status}
            />
        );
    } catch {
        return (
            <AdminRequestsPage
                requests={[]}
                pagination={null}
                counts={null}
                initialStatus={status}
            />
        );
    }
}