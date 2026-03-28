// ═══════════════════════════════════════════════════════
// Owner Cities Page — серверный компонент
// GET запросы через CityService
// ═══════════════════════════════════════════════════════

import CityService from '@/services/city.service';
import CitiesPage from '@/modules/PrivatePages/OwnerPages/CitiesPage/CitiesPage';

const OwnerCitiesPage = async ({ searchParams }) => {
    const sp = await searchParams;
    const page = Number(sp?.page) || 1;
    const query = sp?.query || '';
    const status = sp?.status || '';

    let cities = [], pagination = null;

    try {
        const result = await CityService.getAllCities(page, 20, query, status);
        cities = result.data;
        pagination = result.pagination;
    } catch { }

    return (
        <CitiesPage
            cities={cities}
            pagination={pagination}
            initialFilters={{ query, status, page }}
        />
    );
};

export default OwnerCitiesPage;