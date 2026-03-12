// ═══════════════════════════════════════════════════════
// Owner Sellers Page — серверный компонент
// Параллельно грузит: продавцов + города + категории
// ═══════════════════════════════════════════════════════

import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';
import SellersPage from '@/modules/PrivatePages/OwnerPages/SellersPage/SellersPage';

const OwnerSellersPage = async () => {
    // Параллельные запросы — быстрее чем последовательно
    const [sellersResult, citiesResult, categoriesResult] = await Promise.all([
        SellerService.getAllSellers({ limit: 50 }).catch(() => ({ data: [], pagination: null })),
        CityService.getAllCities(1, 100).catch(() => ({ data: [] })),
        CategoryService.getAllGlobalCategories(1, 100).catch(() => ({ data: [] })),
    ]);

    return (
        <SellersPage
            sellers={sellersResult.data}
            pagination={sellersResult.pagination}
            cities={citiesResult.data}
            categories={categoriesResult.data}
        />
    );
};

export default OwnerSellersPage;