// src/app/admins-piruza/owner/requests/page.js

import RequestsPage from '@/modules/PrivatePages/OwnerPages/RequestsPage/RequestsPage';
import RequestService from '@/services/request.service';

export default async function Page() {
    let requests = [];
    let pagination = null;

    try {
        const res = await RequestService.getAllRequests({ limit: 50 });
        requests = res.data || [];
        pagination = res.pagination || null;
    } catch {
        requests = [];
    }

    return (
        <RequestsPage
            requests={requests}
            pagination={pagination}
        />
    );
}