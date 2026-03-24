// src/app/admins-piruza/manager/sellers/[slug]/products/[productSlug]/page.js

import { notFound } from 'next/navigation';
import ProductDetailPage from '@/modules/PrivatePages/ProductDetailPage/ProductDetailPage';
import ProductService from '@/services/product.service';
import SellerService from '@/services/seller.service';
import CategoryService from '@/services/category.service';

export default async function Page({ params }) {
    const { slug, productSlug } = await params;

    let seller, product, categories;

    try {
        seller = await SellerService.getSellerBySlug(slug);
    } catch {
        notFound();
    }

    try {
        product = await ProductService.getProductBySlug(seller._id, productSlug);
    } catch {
        notFound();
    }

    try {
        const res = await CategoryService.getSellerCategories(seller._id, 1, 100);
        categories = res?.data || [];
    } catch {
        categories = [];
    }

    return (
        <ProductDetailPage
            product={product}
            categories={categories}
            sellerSlug={slug}
            basePath="/admins-piruza/manager/sellers"
        />
    );
}