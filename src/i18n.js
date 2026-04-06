import { getRequestConfig } from 'next-intl/server';
import fr from './messages/fr.json';
import ru from './messages/ru.json';

const locales = ['fr', 'ru'];
const defaultLocale = 'fr';

const messages = { fr, ru };

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale)) {
        locale = defaultLocale;
    }

    return {
        locale,
        messages: messages[locale],
    };
});

export { locales, defaultLocale };