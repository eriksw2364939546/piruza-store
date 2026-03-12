// src/app/admins-piruza/admin-panel/sellers/create/page.js

import SellerFormPage from '@/modules/PrivatePages/SellerFormPage/SellerFormPage';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';

export default async function Page() {
    const [citiesRes, categoriesRes] = await Promise.all([
        CityService.getActiveCities().catch(() => ({ data: [] })),
        CategoryService.getGlobalCategories().catch(() => ({ data: [] })),
    ]);

    return (
        <SellerFormPage
            cities={citiesRes.data || []}
            categories={categoriesRes.data || []}
            basePath="/admins-piruza/admin-panel/sellers"
        />
    );
}