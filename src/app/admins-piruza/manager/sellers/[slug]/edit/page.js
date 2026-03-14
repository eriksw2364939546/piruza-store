// src/app/admins-piruza/manager/sellers/[slug]/edit/page.js

import { notFound } from 'next/navigation';
import SellerFormPage from '@/modules/PrivatePages/SellerFormPage/SellerFormPage';
import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';

export default async function Page({ params }) {
    const { slug } = await params;

    let seller, cities, categories;

    try {
        seller = await SellerService.getSellerBySlug(slug);
    } catch {
        notFound();
    }

    [cities, categories] = await Promise.all([
        CityService.getActiveCities(1, 100)
            .then(r => r?.data || [])
            .catch(() => []),

        CategoryService.getGlobalCategories(1, 100)
            .then(r => r?.data || [])
            .catch(() => []),
    ]);

    return (
        <SellerFormPage
            mode="edit"
            seller={seller}
            basePath="/admins-piruza/manager/sellers"
            cities={cities}
            categories={categories}
            showInactive={false}
        />
    );
}