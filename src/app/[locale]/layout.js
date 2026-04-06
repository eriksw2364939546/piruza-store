import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import CityService from '@/services/city.service';
import LanguageButton from '@/components/LanguageButton/LanguageButton';

const locales = ['fr', 'ru'];

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
            <LanguageButton locale={locale} />
            {children}
            <Footer />
        </NextIntlClientProvider>
    );
}