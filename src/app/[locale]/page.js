// src/app/[locale]/page.js

import CityService from '@/services/city.service';
import CategoryService from '@/services/category.service';
import SellerService from '@/services/seller.service';
import HomePage from '@/modules/HomePage/HomePage';

const META = {
  fr: {
    title: 'Piruza Store — Le marché local de votre ville',
    description: 'Découvrez des artisans et vendeurs locaux proposant des spécialités faites main. Commande directe via WhatsApp, sans intermédiaire.',
    keywords: 'marché local, vendeurs locaux, produits faits maison, artisans, WhatsApp, spécialités',
  },
  ru: {
    title: 'Piruza Store — Местный рынок вашего города',
    description: 'Откройте для себя местных мастеров и продавцов с домашними продуктами. Прямой заказ через WhatsApp, без посредников.',
    keywords: 'местный рынок, местные продавцы, домашние продукты, мастера, WhatsApp, специалитеты',
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const meta = META[locale] || META.fr;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://piruzastore.online/${locale}`,
      languages: {
        'fr': 'https://piruzastore.online/fr',
        'ru': 'https://piruzastore.online/ru',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://piruzastore.online/${locale}`,
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
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['https://piruzastore.online/og/og-default.png'],
    },
  };
}

export default async function Home({ params }) {
  const { locale } = await params;

  const [categoriesRes, citiesRes, sellersRes] = await Promise.allSettled([
    CategoryService.getGlobalCategories(1, 100),
    CityService.getActiveCities(1, 100),
    SellerService.getActiveSellers({ limit: 20, sort: 'views' }),
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