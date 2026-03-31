// ═══════════════════════════════════════════════════════
// clientApi.js — API хелпер для клиентского приложения
// Использует HttpOnly cookie (credentials: include)
// ═══════════════════════════════════════════════════════

const API_URL = '/api/proxy';

async function clientFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include', // отправляем cookie автоматически
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || 'Ошибка запроса');
    }

    return json;
}

export const clientApi = {
    get: (path) => clientFetch(path),
    patch: (path, body) => clientFetch(path, { method: 'PATCH', body: JSON.stringify(body) }),
    post: (path, body) => clientFetch(path, { method: 'POST', body: JSON.stringify(body) }),
    delete: (path) => clientFetch(path, { method: 'DELETE' }),
};