// src/app/admins-piruza/admin-panel/requests/page.js

import AdminRequestsPage from '@/modules/PrivatePages/AdminPages/AdminRequestsPage/AdminRequestsPage';
import RequestService from '@/services/request.service';

export default async function Page() {
    const result = await RequestService.getAllRequests()
        .catch(() => ({ data: [], pagination: null }));

    return (
        <AdminRequestsPage
            requests={result.data}
            pagination={result.pagination}
        />
    );
}