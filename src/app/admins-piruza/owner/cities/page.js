// ═══════════════════════════════════════════════════════
// Owner Cities Page — серверный компонент
// GET запросы через CityService
// ═══════════════════════════════════════════════════════

import CityService from '@/services/city.service';
import CitiesPage from '@/modules/PrivatePages/OwnerPages/CitiesPage/CitiesPage';

const OwnerCitiesPage = async () => {
    let cities = [];
    let pagination = null;

    try {
        const result = await CityService.getAllCities();
        cities = result.data;
        pagination = result.pagination;
    } catch {
        // Ошибка — показываем пустую таблицу
    }

    return (
        <CitiesPage
            cities={cities}
            pagination={pagination}
        />
    );
};

export default OwnerCitiesPage;