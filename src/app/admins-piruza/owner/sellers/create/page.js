// ═══════════════════════════════════════════════════════
// src/app/admins-piruza/owner/sellers/create/page.js
// ═══════════════════════════════════════════════════════

import SellerFormPage from '@/modules/PrivatePages/SellerFormPage/SellerFormPage';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';

export default async function Page() {
    const [citiesRes, categoriesRes] = await Promise.all([
        CityService.getAllCities().catch(() => ({ data: [] })),
        CategoryService.getAllGlobalCategories().catch(() => ({ data: [] })),
    ]);

    return (
        <SellerFormPage
            cities={citiesRes.data || []}
            categories={categoriesRes.data || []}
            showInactive={true}
        />
    );
}


