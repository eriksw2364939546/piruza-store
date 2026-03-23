import { NextResponse } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';
const CLIENT_COOKIE = 'client_token';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    // ── Защита /cabinet ──
    if (pathname.startsWith('/cabinet')) {
        const clientToken = request.cookies.get(CLIENT_COOKIE)?.value;
        if (!clientToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // ── Страница логина клиента ──
    if (pathname === '/login') {
        const clientToken = request.cookies.get(CLIENT_COOKIE)?.value;
        if (clientToken) {
            return NextResponse.redirect(new URL('/cabinet', request.url));
        }
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // ── Страница логина админки ──
    if (pathname === '/admins-piruza/login') {
        const adminToken = request.cookies.get(COOKIE_NAME)?.value;
        if (adminToken) {
            return NextResponse.redirect(new URL('/admins-piruza', request.url));
        }
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // ── Все остальные страницы админки ──
    if (pathname.startsWith('/admins-piruza')) {
        const adminToken = request.cookies.get(COOKIE_NAME)?.value;
        if (!adminToken) {
            const loginUrl = new URL('/admins-piruza/login', request.url);
            loginUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    matcher: ['/admins-piruza/:path*', '/cabinet/:path*', '/cabinet', '/login'],
};