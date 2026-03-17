// src/app/admins-piruza/owner/ratings/page.js

import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';
import RatingsListPage from '@/modules/PrivatePages/OwnerPages/RatingsPage/RatingsListPage';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const query = params?.query || '';
    const status = params?.status || '';
    const city = params?.city || '';
    const category = params?.category || '';
    const page = Number(params?.page) || 1;

    const [sellersResult, citiesResult, categoriesResult] = await Promise.all([
        SellerService.getAllSellers({ query, status, city, category, page, limit: 20 })
            .catch(() => ({ data: [], pagination: null })),
        CityService.getAllCities(1, 100)
            .catch(() => ({ data: [] })),
        CategoryService.getAllGlobalCategories(1, 100)
            .catch(() => ({ data: [] })),
    ]);

    return (
        <RatingsListPage
            sellers={sellersResult.data}
            pagination={sellersResult.pagination}
            cities={citiesResult.data}
            categories={categoriesResult.data}
            initialFilters={{ query, status, city, category }}
        />
    );
}