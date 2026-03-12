// ═══════════════════════════════════════════════════════
// Auth Service — все запросы к /api/auth/*
// Используется для: профиль, менеджеры, администраторы
// ═══════════════════════════════════════════════════════

import { apiWithAuth, apiPut, apiDelete } from '@/lib/api';
import { getTokenOrRedirect } from '@/lib/auth';

class AuthService {

    // ════════════════════════════════════════
    // ПРОФИЛЬ
    // ════════════════════════════════════════

    /**
     * Получить профиль текущего пользователя
     * GET /api/auth/profile
     */
    async getProfile() {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth('/api/auth/profile', token);
        return json.data;
    }

    /**
     * Обновить свой профиль
     * PUT /api/auth/profile
     */
    async updateOwnProfile(token, body) {
        const json = await apiPut('/api/auth/profile', token, body);
        return json.data;
    }

    // ════════════════════════════════════════
    // ПОЛЬЗОВАТЕЛИ (Owner/Admin)
    // ════════════════════════════════════════

    /**
     * Список пользователей с фильтром по роли
     * GET /api/auth/users?role=manager|admin
     * Owner видит всех, Admin — admin+manager
     */
    async getAllUsers(role) {
        const token = await getTokenOrRedirect();
        const query = role ? `?role=${role}` : '';
        const json = await apiWithAuth(`/api/auth/users${query}`, token);
        return json.data || [];
    }

    /**
     * Пользователь по ID
     * GET /api/auth/users/:id
     */
    async getUserById(id) {
        const token = await getTokenOrRedirect();
        const json = await apiWithAuth(`/api/auth/users/${id}`, token);
        return json.data;
    }

    /**
     * Обновить пользователя (Owner only)
     * PUT /api/auth/users/:id
     * Поля: name?, email?, password?, role?, isActive?
     */
    async updateUser(token, id, body) {
        const json = await apiPut(`/api/auth/users/${id}`, token, body);
        return json.data;
    }

    /**
     * Удалить пользователя (Owner only)
     * DELETE /api/auth/users/:id
     */
    async deleteUser(token, id) {
        const json = await apiDelete(`/api/auth/users/${id}`, token);
        return json.data;
    }
}

export default new AuthService();