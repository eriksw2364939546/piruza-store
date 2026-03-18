// src/app/admins-piruza/owner/sellers/page.js

import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';
import SellersPage from '@/modules/PrivatePages/OwnerPages/SellersPage/SellersPage';

const OwnerSellersPage = async ({ searchParams }) => {
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
        CityService.getAllCities(1, 100)
            .catch(() => ({ data: [] })),
        CategoryService.getAllGlobalCategories(1, 100)
            .catch(() => ({ data: [] })),
    ]);

    return (
        <SellersPage
            sellers={sellersResult.data}
            pagination={sellersResult.pagination}
            cities={citiesResult.data}
            categories={categoriesResult.data}
            initialFilters={{ query, status, city, category, mine }}
        />
    );
};

export default OwnerSellersPage;