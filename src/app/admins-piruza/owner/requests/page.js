// src/app/admins-piruza/owner/requests/page.js

import RequestsPage from '@/modules/PrivatePages/OwnerPages/RequestsPage/RequestsPage';
import RequestService from '@/services/request.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const status = params?.status || '';

    try {
        const res = await RequestService.getAllRequests({ status, limit: 50 });

        return (
            <RequestsPage
                requests={res.data || []}
                pagination={res.pagination || null}
                counts={res.counts || null}
                initialStatus={status}
            />
        );
    } catch {
        return (
            <RequestsPage
                requests={[]}
                pagination={null}
                counts={null}
                initialStatus={status}
            />
        );
    }
}