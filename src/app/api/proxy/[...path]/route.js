import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.API_URL + '/api';

async function handler(request, { params }) {
    const { path } = await params;
    const pathname = path.join('/');
    const search = request.nextUrl.search;
    const url = `${BACKEND_URL}/${pathname}${search}`;

    const cookieStore = await cookies();
    const clientToken = cookieStore.get('client_token')?.value;
    const adminToken = cookieStore.get('admin_token')?.value;

    const headers = {
        'Content-Type': 'application/json',
    };

    if (clientToken) {
        headers['Cookie'] = `client_token=${clientToken}`;
    }
    if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const options = {
        method: request.method,
        headers,
        credentials: 'include',
    };

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const body = await request.text();
        if (body) options.body = body;
    }

    const res = await fetch(url, options);
    const json = await res.json();

    const response = NextResponse.json(json, { status: res.status });

    // Пробрасываем Set-Cookie если бэкенд устанавливает куки
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        response.headers.set('set-cookie', setCookie);
    }

    return response;
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;