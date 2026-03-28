// src/app/admins-piruza/owner/ratings/[slug]/page.js

import { notFound } from 'next/navigation';
import SellerService from '@/services/seller.service';
import RatingService from '@/services/rating.service';
import RatingDetailPage from '@/modules/PrivatePages/OwnerPages/RatingsPage/RatingDetailPage';

export default async function Page({ params, searchParams }) {
    const { slug } = await params;
    const sp = await searchParams;
    const ratingFilter = sp?.rating || '';
    const query = sp?.query || '';
    const page = Number(sp?.page) || 1;

    let seller;

    try {
        seller = await SellerService.getSellerBySlug(slug);
    } catch {
        notFound();
    }

    const [statsResult, ratingsResult] = await Promise.allSettled([
        RatingService.getSellerRatingStats(seller._id),
        RatingService.getSellerRatingList(seller._id, {
            page,
            limit: 20,
            rating: ratingFilter,
            query,
        }),
    ]);

    const stats = statsResult.status === 'fulfilled' ? statsResult.value : null;
    const ratingsData = ratingsResult.status === 'fulfilled' ? (ratingsResult.value.data || []) : [];
    const ratingsPagination = ratingsResult.status === 'fulfilled' ? (ratingsResult.value.pagination || null) : null;

    return (
        <RatingDetailPage
            seller={seller}
            stats={stats}
            ratings={ratingsData}
            pagination={ratingsPagination}
            ratingFilter={ratingFilter}
            initialQuery={query}
            basePath="/admins-piruza/owner/ratings"
        />
    );
}