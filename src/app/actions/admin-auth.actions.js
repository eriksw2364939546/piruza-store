'use server';

// ═══════════════════════════════════════════════════════
// Admin Auth Actions — авторизация + управление пользователями
// Используется для: login/logout, менеджеры, администраторы, профиль
// ═══════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiPost } from '@/lib/api';
import { setToken, deleteToken, getTokenOrRedirect } from '@/lib/auth';
import AuthService from '@/services/auth.service';

const ROLE_REDIRECTS = {
    owner: '/admins-piruza/owner',
    admin: '/admins-piruza/admin-panel',
    manager: '/admins-piruza/manager',
};

// ════════════════════════════════════════
// АВТОРИЗАЦИЯ
// ════════════════════════════════════════

export async function loginAction(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { success: false, message: 'Заполните все поля' };
    }

    let destination;

    try {
        const json = await apiPost('/api/auth/login', null, { email, password });
        const { token, user } = json.data;

        destination = ROLE_REDIRECTS[user.role];
        if (!destination) {
            return { success: false, message: 'Доступ запрещён' };
        }

        await setToken(token);
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка входа' };
    }

    // redirect() ОБЯЗАТЕЛЬНО вне try/catch
    redirect(destination);
}

export async function logoutAction() {
    await deleteToken();
    redirect('/admins-piruza/login');
}

// ════════════════════════════════════════
// СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ (Owner only)
// FormData: name, email, password, role ('manager' | 'admin')
// ════════════════════════════════════════

export async function createUserAction(prevState, formData) {
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();
    const role = formData.get('role');           // 'manager' или 'admin'

    if (!name || !email || !password || !role) {
        return { success: false, message: 'Заполните все обязательные поля' };
    }

    try {
        const token = await getTokenOrRedirect();
        const json = await apiPost('/api/auth/register', token, { name, email, password, role });
        revalidatePath(`/admins-piruza/owner/${role === 'manager' ? 'managers' : 'admins'}`);
        return { success: true, message: `${role === 'manager' ? 'Менеджер' : 'Администратор'} создан`, data: json.data };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания' };
    }
}

// ════════════════════════════════════════
// ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (Owner only)
// FormData: id, name?, email?, password?, isActive?, role?
// ════════════════════════════════════════

export async function updateUserAction(prevState, formData) {
    const id = formData.get('id');
    const role = formData.get('role');     // для revalidatePath
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();
    const newRole = formData.get('newRole');
    const isActive = formData.get('isActive');

    if (!id) return { success: false, message: 'ID не указан' };

    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password) body.password = password;
    if (newRole) body.role = newRole;
    if (isActive !== null && isActive !== undefined) {
        body.isActive = isActive === 'true';
    }

    try {
        const token = await getTokenOrRedirect();
        const data = await AuthService.updateUser(token, id, body);
        revalidatePath(`/admins-piruza/owner/${role === 'manager' ? 'managers' : 'admins'}`);
        return { success: true, message: 'Пользователь обновлён', data };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка обновления' };
    }
}

// ════════════════════════════════════════
// УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (Owner only)
// ════════════════════════════════════════

export async function deleteUserAction(id, role) {
    try {
        const token = await getTokenOrRedirect();
        await AuthService.deleteUser(token, id);
        revalidatePath(`/admins-piruza/owner/${role === 'manager' ? 'managers' : 'admins'}`);
        return { success: true, message: 'Пользователь удалён' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления' };
    }
}

// ════════════════════════════════════════
// ПЕРЕКЛЮЧИТЬ СТАТУС (Owner only)
// ════════════════════════════════════════

export async function toggleUserStatusAction(id, currentStatus, role) {
    try {
        const token = await getTokenOrRedirect();
        await AuthService.updateUser(token, id, { isActive: !currentStatus });
        revalidatePath(`/admins-piruza/owner/${role === 'manager' ? 'managers' : 'admins'}`);
        return {
            success: true,
            message: !currentStatus ? 'Пользователь активирован' : 'Пользователь деактивирован'
        };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка' };
    }
}

// ════════════════════════════════════════
// ОБНОВИТЬ СВОЙ ПРОФИЛЬ
// FormData: name?, email?, password?
// ════════════════════════════════════════

export async function updateOwnProfileAction(prevState, formData) {
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();

    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password) body.password = password;

    if (Object.keys(body).length === 0) {
        return { success: false, message: 'Нет данных для обновления' };
    }

    try {
        const token = await getTokenOrRedirect();
        const data = await AuthService.updateOwnProfile(token, body);
        revalidatePath('/admins-piruza/owner/profile');
        revalidatePath('/admins-piruza/admin-panel/profile');
        revalidatePath('/admins-piruza/manager/profile');
        return { success: true, message: 'Профиль обновлён', data };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка обновления' };
    }
}