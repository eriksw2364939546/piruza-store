// src/app/admins-piruza/manager/sellers/page.js

import ManagerSellersPage from '@/modules/PrivatePages/ManagerPages/ManagerSellersPage/ManagerSellersPage';
import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const status = params?.status || '';
    const query = params?.query || '';
    const city = params?.city || '';
    const category = params?.category || '';
    const page = Number(params?.page) || 1;

    let sellers = [], pagination = null, counts = {}, cities = [], categories = [];

    try {
        const result = await SellerService.getAllSellers({ query, status, city, category, page, limit: 10 });
        sellers = result?.data || [];
        pagination = result?.pagination || null;
        counts = result?.counts || {};
    } catch {
        sellers = [];
    }

    try {
        const res = await CityService.getActiveCities(1, 100);
        cities = res?.data || [];
    } catch { cities = []; }

    try {
        const res = await CategoryService.getGlobalCategories(1, 100);
        categories = res?.data || [];
    } catch { categories = []; }

    return (
        <ManagerSellersPage
            sellers={sellers}
            pagination={pagination}
            counts={counts}
            cities={cities}
            categories={categories}
            initialStatus={status}
            initialQuery={query}
            initialCity={city}
            initialCategory={category}
        />
    );
}