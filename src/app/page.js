// src/app/page.js

import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';
import SellerService from '@/services/seller.service';
import HomePage from '@/modules/HomePage/HomePage';

export default async function Home() {
  const [categoriesRes, citiesRes, sellersRes] = await Promise.allSettled([
    CategoryService.getGlobalCategories(1, 100),
    CityService.getActiveCities(1, 100),
    SellerService.getActiveSellers({ limit: 100 }),
  ]);

  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data || [] : [];
  const cities = citiesRes.status === 'fulfilled' ? citiesRes.value.data || [] : [];
  const sellers = sellersRes.status === 'fulfilled' ? sellersRes.value.data || [] : [];

  return (
    <HomePage
      categories={categories}
      cities={cities}
      sellers={sellers}
    />
  );
}