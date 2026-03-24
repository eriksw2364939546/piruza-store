// src/app/sellers/[slug]/products/[productSlug]/page.js

import { notFound } from 'next/navigation';
import SellerService from '@/services/seller.service';
import ProductService from '@/services/product.service';
import PublicProductDetailPage from '@/modules/PublicProductDetailPage/PublicProductDetailPage';

export default async function Page({ params }) {
    const { slug, productSlug } = await params;

    let seller, product;

    try {
        seller = await SellerService.getPublicSellerBySlug(slug);
    } catch {
        notFound();
    }

    try {
        product = await ProductService.getPublicProductBySlug(seller._id, productSlug);
    } catch {
        notFound();
    }

    return (
        <PublicProductDetailPage
            product={product}
            seller={seller}
        />
    );
}