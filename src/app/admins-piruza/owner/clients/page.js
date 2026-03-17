// src/app/admins-piruza/owner/clients/page.js

import ClientService from '@/services/client.service';
import ClientsListPage from '@/modules/PrivatePages/OwnerPages/ClientsPage/ClientsListPage';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const query = params?.query || '';
    const isActive = params?.isActive ?? '';
    const page = Number(params?.page) || 1;

    const result = await ClientService.getAllClients({ query, isActive, page, limit: 20 })
        .catch(() => ({ data: [], pagination: null }));

    return (
        <ClientsListPage
            clients={result.data}
            pagination={result.pagination}
            initialQuery={query}
            initialActive={isActive}
        />
    );
}