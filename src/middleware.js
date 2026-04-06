import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.js';

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';
const CLIENT_COOKIE = 'client_token';

// next-intl middleware — обрабатывает локаль
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always', // всегда /fr/ или /ru/ в URL
});

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    // ── Админка — next-intl не трогает, только защита ──
    if (pathname.startsWith('/admins-piruza')) {
        const adminToken = request.cookies.get(COOKIE_NAME)?.value;

        if (pathname === '/admins-piruza/login') {
            if (adminToken) {
                return NextResponse.redirect(new URL('/admins-piruza', request.url));
            }
            return NextResponse.next({ request: { headers: requestHeaders } });
        }

        if (!adminToken) {
            const loginUrl = new URL('/admins-piruza/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // ── Публичные роуты — сначала определяем локаль ──
    // Извлекаем локаль из pathname (/fr/... или /ru/...)
    const pathnameLocale = locales.find(
        (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    );
    const locale = pathnameLocale || defaultLocale;

    // ── Защита /cabinet ──
    if (pathname.match(/^\/(fr|ru)\/cabinet/)) {
        const clientToken = request.cookies.get(CLIENT_COOKIE)?.value;
        if (!clientToken) {
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    // ── Страница логина клиента ──
    if (pathname.match(/^\/(fr|ru)\/login$/)) {
        const clientToken = request.cookies.get(CLIENT_COOKIE)?.value;
        if (clientToken) {
            return NextResponse.redirect(new URL(`/${locale}/cabinet`, request.url));
        }
    }

    // ── Всё остальное — передаём next-intl ──
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/admins-piruza/:path*',
        '/(fr|ru)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};