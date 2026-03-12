// ═══════════════════════════════════════════════════════
// API Client — Server Components и Server Actions
// ═══════════════════════════════════════════════════════

// Серверный компонент использует API_URL (без NEXT_PUBLIC)
// Server Actions тоже серверные — используют API_URL
const API_URL = process.env.API_URL;

/**
 * Базовый fetch запрос
 * @param {string} endpoint - путь /api/...
 * @param {object} options - fetch опции
 * @returns {Promise<object>} - { data, message, success }
 * @throws {Error} - если запрос неуспешный
 */
async function request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, config);
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.message || 'Ошибка запроса');
    }

    return json;
}

/**
 * GET запрос (публичный, без токена)
 * @example
 * const json = await api('/api/sellers/public/active');
 */
export async function api(endpoint, options = {}) {
    return request(endpoint, {
        ...options,
        cache: options.cache ?? 'no-store',
    });
}

/**
 * GET запрос с токеном авторизации
 * @example
 * const json = await apiWithAuth('/api/dashboard/overview', token);
 */
export async function apiWithAuth(endpoint, token, options = {}) {
    return request(endpoint, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
        cache: options.cache ?? 'no-store',
    });
}

/**
 * POST запрос с токеном
 * @example
 * const json = await apiPost('/api/sellers', token, { name: 'Test' });
 */
export async function apiPost(endpoint, token, body) {
    return request(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
}

/**
 * PUT запрос с токеном
 * @example
 * const json = await apiPut('/api/sellers/123', token, { name: 'Updated' });
 */
export async function apiPut(endpoint, token, body) {
    return request(endpoint, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
}

/**
 * PATCH запрос с токеном
 * @example
 * const json = await apiPatch('/api/sellers/123/activate', token, { months: 1 });
 */
export async function apiPatch(endpoint, token, body) {
    return request(endpoint, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
}

/**
 * DELETE запрос с токеном
 * @example
 * const json = await apiDelete('/api/sellers/123', token);
 */
export async function apiDelete(endpoint, token) {
    return request(endpoint, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    });
}