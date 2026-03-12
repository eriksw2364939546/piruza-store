// src/app/admins-piruza/admin-panel/sellers/[slug]/page.js

import { notFound } from 'next/navigation';
import SellerDetailPage from '@/modules/PrivatePages/SellerDetailPage/SellerDetailPage';
import SellerService from '@/services/seller.service';
import ProductService from '@/services/product.service';
import CategoryService from '@/services/category.service';

export default async function Page({ params }) {
    const { slug } = await params;

    let seller;
    try {
        seller = await SellerService.getSellerBySlug(slug);
    } catch {
        notFound();
    }

    const [products, categories] = await Promise.all([
        ProductService.getProductsBySeller(seller._id).then(r => r.data || []).catch(() => []),
        CategoryService.getSellerCategories(seller._id).then(r => r.data || []).catch(() => []),
    ]);

    return (
        <SellerDetailPage
            seller={seller}
            products={products}
            categories={categories}
            basePath="/admins-piruza/admin-panel/sellers"
        />
    );
}