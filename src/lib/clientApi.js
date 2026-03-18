// ═══════════════════════════════════════════════════════
// clientApi.js — API хелпер для клиентского приложения
// Использует токен из localStorage
// ═══════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api';

function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

async function clientFetch(path, options = {}) {
    const token = getToken();
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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