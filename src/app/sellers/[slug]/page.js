// src/app/sellers/[slug]/page.js

import { notFound } from 'next/navigation';
import SellerService from '@/services/seller.service';
import CategoryService from '@/services/category.service';
import ProductService from '@/services/product.service';
import SellerProfilePage from '@/modules/SellerProfilePage/SellerProfilePage';

export default async function Page({ params, searchParams }) {
    const { slug } = await params;
    const sp = await searchParams;
    const category = sp?.category || '';
    const query = sp?.query || '';
    const page = Number(sp?.page) || 1;

    // Продавец по slug
    let seller;
    try {
        seller = await SellerService.getPublicSellerBySlug(slug);
    } catch {
        notFound();
    }

    const [categoriesRes, productsRes] = await Promise.allSettled([
        CategoryService.getPublicSellerCategories(seller._id),
        ProductService.getPublicProductsBySeller(seller._id, page, 10, query, category),
    ]);

    const categories = categoriesRes.status === 'fulfilled'
        ? categoriesRes.value.data || [] : [];

    const products = productsRes.status === 'fulfilled'
        ? productsRes.value.data || [] : [];

    const pagination = productsRes.status === 'fulfilled'
        ? productsRes.value.pagination || null : null;

    return (
        <SellerProfilePage
            seller={seller}
            categories={categories}
            products={products}
            pagination={pagination}
            initialFilters={{ category, query, page }}
        />
    );
}