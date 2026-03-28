// ═══════════════════════════════════════════════════════
// Auth Utilities — Server Components и Server Actions
// ═══════════════════════════════════════════════════════

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_token';
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE) || 86400; // 24 часа

/**
 * Получить токен из cookie (Server Side)
 * @returns {Promise<string|null>}
 * @example
 * const token = await getToken();
 * if (!token) redirect('/admins-piruza/login');
 */
export async function getToken() {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * Получить токен — если нет, редирект на логин
 * Используй в page.js и service файлах
 * @returns {Promise<string>}
 * @example
 * const token = await getTokenOrRedirect();
 */
export async function getTokenOrRedirect() {
    const token = await getToken();

    if (!token) {
        redirect('/admins-piruza/login');
    }

    return token;
}

/**
 * Сохранить токен в httpOnly cookie
 * @param {string} token - JWT токен
 * @example
 * await setToken(token);
 */
export async function setToken(token) {
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
    });
}

/**
 * Удалить токен из cookie (выход)
 * @example
 * await deleteToken();
 */
export async function deleteToken() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

const CLIENT_COOKIE_NAME = 'client_token';

export async function getClientToken() {
    const cookieStore = await cookies();
    return cookieStore.get(CLIENT_COOKIE_NAME)?.value || null;
}

export async function getClientTokenOrRedirect() {
    const token = await getClientToken();
    if (!token) redirect('/login');
    return token;
}