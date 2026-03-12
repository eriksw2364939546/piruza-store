// src/app/admins-piruza/admin-panel/sellers/[slug]/edit/page.js

import { notFound } from 'next/navigation';
import SellerFormPage from '@/modules/PrivatePages/SellerFormPage/SellerFormPage';
import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';

export default async function Page({ params }) {
    const { slug } = await params;

    let seller;
    try {
        seller = await SellerService.getSellerBySlug(slug);
    } catch {
        notFound();
    }

    const [citiesRes, categoriesRes] = await Promise.all([
        CityService.getActiveCities().catch(() => ({ data: [] })),
        CategoryService.getGlobalCategories().catch(() => ({ data: [] })),
    ]);

    return (
        <SellerFormPage
            seller={seller}
            cities={citiesRes.data || []}
            categories={categoriesRes.data || []}
            basePath="/admins-piruza/admin-panel/sellers"
        />
    );
}