import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.js';

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';
const CLIENT_COOKIE = 'client_token';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
});

async function getSiteMode() {
    try {
        const res = await fetch(
            `${process.env.API_URL}/api/settings/site-mode`,
            { cache: 'no-store' }
        );
        const json = await res.json();
        return json.data?.mode || 'coming_soon';
    } catch {
        return 'coming_soon';
    }
}

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    // ── Админка — всегда доступна ──
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

    // ── Корень / — всегда WelcomePage или редирект ──
    if (pathname === '/') {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // ── Проверяем site_mode для всех публичных роутов ──
    const siteMode = await getSiteMode();
    if (siteMode === 'coming_soon') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ── Защита /cabinet ──
    const pathnameLocale = locales.find(
        (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    );
    const locale = pathnameLocale || defaultLocale;

    if (pathname.match(/^\/(fr|ru)\/cabinet/)) {
        const clientToken = request.cookies.get(CLIENT_COOKIE)?.value;
        if (!clientToken) {
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    if (pathname.match(/^\/(fr|ru)\/login$/)) {
        const clientToken = request.cookies.get(CLIENT_COOKIE)?.value;
        if (clientToken) {
            return NextResponse.redirect(new URL(`/${locale}/cabinet`, request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/admins-piruza/:path*',
        '/(fr|ru)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};