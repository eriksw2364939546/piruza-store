// ═══════════════════════════════════════════════════════
// Owner Categories Page — серверный компонент
// GET запросы через CategoryService
// ═══════════════════════════════════════════════════════

import CategoryService from '@/services/category.service';
import CategoriesPage from '@/modules/PrivatePages/OwnerPages/CategoriesPage/CategoriesPage';

const OwnerCategoriesPage = async () => {
    let categories = [];
    let pagination = null;

    try {
        const result = await CategoryService.getAllGlobalCategories();
        categories = result.data;
        pagination = result.pagination;
    } catch {
        // Ошибка — показываем пустую таблицу
    }

    return (
        <CategoriesPage
            categories={categories}
            pagination={pagination}
        />
    );
};

export default OwnerCategoriesPage;