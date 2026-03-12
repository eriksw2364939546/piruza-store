// ═══════════════════════════════════════════════════════
// Middleware — Защита /admins-piruza/* маршрутов
// ═══════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // Добавляем pathname в headers — используется в root layout
    // чтобы скрыть публичный Header/Footer для админских роутов
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    // ── Страница логина ──
    if (pathname === '/admins-piruza/login') {
        // Уже авторизован → на дашборд
        if (token) {
            return NextResponse.redirect(new URL('/admins-piruza', request.url));
        }
        // Нет токена → показываем логин
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // ── Все остальные страницы админки ──
    if (!token) {
        const loginUrl = new URL('/admins-piruza/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    matcher: '/admins-piruza/:path*',
};