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

    let allSellers = [];
    let cities = [];
    let categories = [];

    try {
        const result = await SellerService.getAllSellers({ limit: 100 });
        allSellers = result?.data || [];
    } catch {
        allSellers = [];
    }

    try {
        const res = await CityService.getActiveCities(1, 100);
        cities = res?.data || [];
    } catch { cities = []; }

    try {
        const res = await CategoryService.getGlobalCategories(1, 100);
        categories = res?.data || [];
    } catch { categories = []; }

    // Фильтрация на сервере
    const sellers = allSellers.filter(s => {
        const matchStatus = !status || s.status === status;
        const matchQuery = !query ||
            s.name?.toLowerCase().includes(query.toLowerCase()) ||
            s.city?.name?.toLowerCase().includes(query.toLowerCase());
        const matchCity = !city || s.city?.slug === city;
        const matchCategory = !category || s.globalCategories?.some(c => c.slug === category);
        return matchStatus && matchQuery && matchCity && matchCategory;
    });

    const counts = {
        all: allSellers.length,
        active: allSellers.filter(s => s.status === 'active').length,
        draft: allSellers.filter(s => s.status === 'draft').length,
        expired: allSellers.filter(s => s.status === 'expired').length,
        inactive: allSellers.filter(s => s.status === 'inactive').length,
    };

    return (
        <ManagerSellersPage
            sellers={sellers}
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