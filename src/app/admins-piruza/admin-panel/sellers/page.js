// src/app/admins-piruza/admin-panel/sellers/page.js

import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';
import AdminSellersPage from '@/modules/PrivatePages/AdminPages/AdminSellersPage/AdminSellersPage';

export default async function Page({ searchParams }) {
    const params = await searchParams;

    const query = params?.query || '';
    const status = params?.status || '';
    const city = params?.city || '';
    const category = params?.category || '';
    const mine = params?.mine || '';
    const page = Number(params?.page) || 1;

    const [sellersResult, citiesResult, categoriesResult] = await Promise.all([
        SellerService.getAllSellers({ query, status, city, category, mine, page, limit: 20 })
            .catch(() => ({ data: [], pagination: null })),
        CityService.getActiveCities(1, 100)           // ← только активные города
            .catch(() => ({ data: [] })),
        CategoryService.getGlobalCategories(1, 100)   // ← только активные категории
            .catch(() => ({ data: [] })),
    ]);

    return (
        <AdminSellersPage
            sellers={sellersResult.data}
            pagination={sellersResult.pagination}
            cities={citiesResult.data}
            categories={categoriesResult.data}
            initialFilters={{ query, status, city, category, mine }}
        />
    );
}