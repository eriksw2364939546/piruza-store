import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import CityService from '@/services/city.service';
import LanguageButton from '@/components/LanguageButton/LanguageButton';

const locales = ['fr', 'ru'];

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isRu = locale === 'ru';

    return {
        title: 'Piruza Store',
        description: isRu
            ? 'Местный рынок вашего города — домашние продукты, заказ напрямую через WhatsApp'
            : 'Le marché local de votre ville — produits faits maison, commande directe via WhatsApp',
        icons: {
            icon: [
                { url: '/favicon.ico' },
                { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            ],
            apple: '/apple-touch-icon.png',
        },
        openGraph: {
            title: 'Piruza Store',
            description: isRu
                ? 'Местный рынок вашего города — домашние продукты, заказ напрямую через WhatsApp'
                : 'Le marché local de votre ville — produits faits maison, commande directe via WhatsApp',
            url: `https://piruzastore.online/${locale}`,
            siteName: 'Piruza Store',
            images: [
                {
                    url: 'https://piruzastore.online/og/og-default.png',
                    width: 1200,
                    height: 630,
                    alt: 'Piruza Store',
                },
            ],
            locale: locale === 'ru' ? 'ru_RU' : 'fr_FR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Piruza Store',
            description: isRu
                ? 'Местный рынок вашего города'
                : 'Le marché local de votre ville',
            images: ['https://piruzastore.online/og/og-default.png'],
        },
    };
}

export default async function LocaleLayout({ children, params }) {
    const { locale } = await params;

    if (!locales.includes(locale)) {
        notFound();
    }

    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const isAdminRoute = pathname.startsWith('/admins-piruza');

    let cities = [];
    if (!isAdminRoute) {
        try {
            const res = await CityService.getActiveCities(1, 100);
            cities = res?.data || [];
        } catch {
            cities = [];
        }
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Header cities={cities} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Piruza Store",
                        "url": "https://piruzastore.online",
                        "description": locale === 'ru'
                            ? 'Местный рынок вашего города — домашние продукты, заказ через WhatsApp'
                            : 'Le marché local de votre ville — produits faits maison, commande via WhatsApp',
                        "areaServed": {
                            "@type": "Country",
                            "name": "France"
                        },
                        "inLanguage": locale === 'ru' ? 'ru' : 'fr',
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": `https://piruzastore.online/${locale}/sellers?query={search_term_string}`
                            },
                            "query-input": "required name=search_term_string"
                        }
                    })
                }}
            />
            <LanguageButton locale={locale} />
            {children}
            <Footer />
        </NextIntlClientProvider>
    );
}