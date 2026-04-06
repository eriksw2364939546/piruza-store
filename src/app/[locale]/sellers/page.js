// src/app/sellers/page.js

import CategoryService from '@/services/category.service';
import SellerService from '@/services/seller.service';
import SellersListPage from '@/modules/SellersListPage/SellersListPage';

export default async function Page({ searchParams }) {
    const params = await searchParams;
    const city = params?.city || '';
    const category = params?.category || '';
    const query = params?.query || '';
    const sort = params?.sort || '';
    const page = Number(params?.page) || 1;

    const [categoriesRes, sellersRes] = await Promise.allSettled([
        CategoryService.getGlobalCategories(1, 100),
        city
            ? SellerService.getPublicSellers({ city, category, query, sort, page, limit: 4 })
            : Promise.resolve({ data: [], pagination: null }),
    ]);

    const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data || [] : [];
    const sellers = sellersRes.status === 'fulfilled' ? sellersRes.value.data || [] : [];
    const pagination = sellersRes.status === 'fulfilled' ? sellersRes.value.pagination || null : null;

    return (
        <SellersListPage
            sellers={sellers}
            pagination={pagination}
            categories={categories}
            initialFilters={{ city, category, query, sort }}
        />
    );
}