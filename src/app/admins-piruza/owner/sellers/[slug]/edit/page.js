// ═══════════════════════════════════════════════════════
// src/app/admins-piruza/owner/sellers/[slug]/edit/page.js
// ═══════════════════════════════════════════════════════

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
        CityService.getAllCities().catch(() => ({ data: [] })),
        CategoryService.getAllGlobalCategories().catch(() => ({ data: [] })),
    ]);

    return (
        <SellerFormPage
            seller={seller}
            cities={citiesRes.data || []}
            categories={categoriesRes.data || []}
            showInactive={true}
        />
    );
}