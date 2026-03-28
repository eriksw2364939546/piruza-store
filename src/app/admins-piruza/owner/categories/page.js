// ═══════════════════════════════════════════════════════
// Owner Categories Page — серверный компонент
// GET запросы через CategoryService
// ═══════════════════════════════════════════════════════

import CategoryService from '@/services/category.service';
import CategoriesPage from '@/modules/PrivatePages/OwnerPages/CategoriesPage/CategoriesPage';

const OwnerCategoriesPage = async ({ searchParams }) => {
    const sp = await searchParams;
    const page = Number(sp?.page) || 1;
    const query = sp?.query || '';
    const status = sp?.status || '';

    let categories = [], pagination = null;
    try {
        const result = await CategoryService.getAllGlobalCategories(page, 20, query, status);
        categories = result.data;
        pagination = result.pagination;
    } catch { }

    return (
        <CategoriesPage
            categories={categories}
            pagination={pagination}
            initialFilters={{ query, status, page }}
        />
    );
};

export default OwnerCategoriesPage;