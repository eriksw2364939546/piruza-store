// src/app/admins-piruza/manager/sellers/[slug]/page.js

import { notFound } from 'next/navigation';
import SellerDetailPage from '@/modules/PrivatePages/SellerDetailPage/SellerDetailPage';
import SellerService from '@/services/seller.service';
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';

export default async function Page({ params, searchParams }) {
    const { slug } = await params;
    const sp = await searchParams;

    const productPage = parseInt(sp?.productPage) || 1;
    const productQuery = sp?.productQuery || '';
    const productCategory = sp?.productCategory || '';

    let seller;
    try {
        seller = await SellerService.getSellerBySlug(slug);
    } catch {
        notFound();
    }

    const [productsResult, categories] = await Promise.all([
        ProductService.getProductsBySeller(
            seller._id, productPage, 3, productQuery, productCategory
        ).catch(() => ({ data: [], pagination: null })),
        CategoryService.getSellerCategories(seller._id)
            .then(r => r.data || []).catch(() => []),
    ]);

    return (
        <SellerDetailPage
            seller={seller}
            products={productsResult.data || []}
            productsPagination={productsResult.pagination || null}
            productsTotalAll={productsResult.counts?.totalAll ?? null}
            categories={categories}
            basePath="/admins-piruza/manager/sellers"
            managerMode={true}
            initialProductFilters={{ page: productPage, query: productQuery, category: productCategory }}
        />
    );
}