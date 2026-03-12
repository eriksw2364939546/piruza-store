// src/app/admins-piruza/admin-panel/sellers/page.js

import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';
import AdminSellersPage from '@/modules/PrivatePages/AdminPages/AdminSellersPage/AdminSellersPage';

export default async function Page() {
    const [sellersResult, citiesResult, categoriesResult] = await Promise.all([
        SellerService.getAllSellers({ limit: 50 }).catch(() => ({ data: [], pagination: null })),
        CityService.getAllCities(1, 100).catch(() => ({ data: [] })),
        CategoryService.getAllGlobalCategories(1, 100).catch(() => ({ data: [] })),
    ]);

    return (
        <AdminSellersPage
            sellers={sellersResult.data}
            pagination={sellersResult.pagination}
            cities={citiesResult.data}
            categories={categoriesResult.data}
        />
    );
}