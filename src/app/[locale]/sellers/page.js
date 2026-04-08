// src/app/[locale]/sellers/page.js

import CategoryService from '@/services/category.service';
import SellerService from '@/services/seller.service';
import CityService from '@/services/city.service';
import SellersListPage from '@/modules/SellersListPage/SellersListPage';

const META = {
    fr: {
        title: (city) => city ? `Vendeurs locaux à ${city} — Piruza Store` : 'Vendeurs locaux — Piruza Store',
        description: (city) => city
            ? `Découvrez les vendeurs locaux à ${city}. Spécialités artisanales, produits faits maison, commande directe via WhatsApp.`
            : 'Découvrez tous les vendeurs locaux près de chez vous. Spécialités artisanales, produits faits maison, commande directe via WhatsApp.',
        keywords: 'vendeurs locaux, artisans, produits faits maison, marché local, WhatsApp',
    },
    ru: {
        title: (city) => city ? `Местные продавцы в ${city} — Piruza Store` : 'Местные продавцы — Piruza Store',
        description: (city) => city
            ? `Найдите местных продавцов в ${city}. Домашние продукты, прямой заказ через WhatsApp.`
            : 'Найдите местных продавцов рядом с вами. Домашние продукты, прямой заказ через WhatsApp.',
        keywords: 'местные продавцы, домашние продукты, местный рынок, WhatsApp',
    },
};

export async function generateMetadata({ params, searchParams }) {
    const { locale } = await params;
    const sp = await searchParams;
    const citySlug = sp?.city || '';

    // Получаем название города для SEO
    let cityName = '';
    if (citySlug) {
        try {
            const res = await CityService.getActiveCities(1, 100);
            const cityDoc = (res?.data || []).find(c => c.slug === citySlug);
            if (cityDoc) cityName = cityDoc.name;
        } catch { }
    }

    const meta = META[locale] || META.fr;
    const title = meta.title(cityName);
    const description = meta.description(cityName);

    return {
        title,
        description,
        keywords: meta.keywords,
        robots: { index: true, follow: true },
        alternates: {
            canonical: `https://piruzastore.online/${locale}/sellers${citySlug ? `?city=${citySlug}` : ''}`,
            languages: {
                'fr': `https://piruzastore.online/fr/sellers${citySlug ? `?city=${citySlug}` : ''}`,
                'ru': `https://piruzastore.online/ru/sellers${citySlug ? `?city=${citySlug}` : ''}`,
            },
        },
        openGraph: {
            title,
            description,
            url: `https://piruzastore.online/${locale}/sellers`,
            siteName: 'Piruza Store',
            images: [
                {
                    url: 'https://piruzastore.online/og/og-default.png',
                    width: 1424,
                    height: 752,
                    alt: 'Piruza Store',
                },
            ],
            locale: locale === 'ru' ? 'ru_RU' : 'fr_FR',
            type: 'website',
        },
    };
}

export default async function Page({ params, searchParams }) {
    const { locale } = await params;
    const sp = await searchParams;
    const city = sp?.city || '';
    const category = sp?.category || '';
    const query = sp?.query || '';
    const sort = sp?.sort || '';
    const page = Number(sp?.page) || 1;

    const [categoriesRes, sellersRes] = await Promise.allSettled([
        CategoryService.getGlobalCategories(1, 100),
        city
            ? SellerService.getPublicSellers({ city, category, query, sort, page, limit: 4 })
            : Promise.resolve({ data: [], pagination: null }),
    ]);

    const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data || [] : [];
    const sellers = sellersRes.status === 'fulfilled' ? sellersRes.value.data || [] : [];
    const pagination = sellersRes.status === 'fulfilled' ? sellersRes.value.pagination || null : null;

    return (
        <SellersListPage
            sellers={sellers}
            pagination={pagination}
            categories={categories}
            initialFilters={{ city, category, query, sort }}
        />
    );
}