// src/app/admins-piruza/owner/clients/[id]/page.js

import { notFound } from 'next/navigation';
import ClientService from '@/services/client.service';
import ClientDetailPage from '@/modules/PrivatePages/OwnerPages/ClientsPage/ClientDetailPage';

export default async function Page({ params, searchParams }) {
    const { id } = await params;
    const sp = await searchParams;
    const ratingFilter = sp?.rating || '';
    const tab = sp?.tab || 'ratings'; // ratings | favorites
    const page = Number(sp?.page) || 1;

    let client, ratings, favorites;

    try {
        client = await ClientService.getClientById(id);
    } catch {
        notFound();
    }

    const [ratingsResult] = await Promise.allSettled([
        ClientService.getClientRatings(id, { page, limit: 20, rating: ratingFilter }),
    ]);

    ratings = ratingsResult.status === 'fulfilled'
        ? ratingsResult.value
        : { data: [], pagination: null };

    return (
        <ClientDetailPage
            client={client}
            ratings={ratings.data}
            ratingsPagination={ratings.pagination}
            ratingFilter={ratingFilter}
            activeTab={tab}
            basePath="/admins-piruza/owner/clients"
        />
    );
}