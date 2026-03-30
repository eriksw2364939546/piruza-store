// src/app/admins-piruza/owner/clients/[id]/page.js

import { notFound } from 'next/navigation';
import ClientService from '@/services/client.service';
import ClientDetailPage from '@/modules/PrivatePages/OwnerPages/ClientsPage/ClientDetailPage';

export default async function Page({ params, searchParams }) {
    const { id } = await params;
    const sp = await searchParams;
    const ratingFilter = sp?.rating || '';
    const tab = sp?.tab || 'ratings';
    const ratPage = Number(sp?.ratPage) || 1;
    const favPage = Number(sp?.favPage) || 1;

    let client;
    try {
        client = await ClientService.getClientById(id);
    } catch {
        notFound();
    }

    const [ratingsResult, favoritesResult] = await Promise.allSettled([
        ClientService.getClientRatings(id, { page: ratPage, limit: 10, rating: ratingFilter }),
        ClientService.getClientFavoritesById(id, { page: favPage, limit: 10 }),
    ]);

    const ratings = ratingsResult.status === 'fulfilled' ? ratingsResult.value.data || [] : [];
    const ratingsPagination = ratingsResult.status === 'fulfilled' ? ratingsResult.value.pagination || null : null;
    const favorites = favoritesResult.status === 'fulfilled' ? favoritesResult.value.data || [] : [];
    const favoritesPagination = favoritesResult.status === 'fulfilled' ? favoritesResult.value.pagination || null : null;

    return (
        <ClientDetailPage
            client={client}
            ratings={ratings}
            ratingsPagination={ratingsPagination}
            favorites={favorites}
            favoritesPagination={favoritesPagination}
            ratingFilter={ratingFilter}
            activeTab={tab}
            basePath="/admins-piruza/owner/clients"
        />
    );
}