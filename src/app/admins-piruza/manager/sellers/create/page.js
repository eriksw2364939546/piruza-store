// src/app/admins-piruza/manager/sellers/create/page.js

import SellerFormPage from '@/modules/PrivatePages/SellerFormPage/SellerFormPage';
import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';

export default async function Page() {
    let cities = [];
    let categories = [];

    try {
        // getActiveCities — публичный, без токена, только активные
        const res = await CityService.getActiveCities(1, 100);
        cities = res?.data || [];
    } catch {
        cities = [];
    }

    try {
        // getGlobalCategories — публичный, без токена, только активные
        const res = await CategoryService.getGlobalCategories(1, 100);
        categories = res?.data || [];
    } catch {
        categories = [];
    }

    return (
        <SellerFormPage
            mode="create"
            basePath="/admins-piruza/manager/sellers"
            cities={cities}
            categories={categories}
            showInactive={false}
        />
    );
}