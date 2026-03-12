'use server';

// ═══════════════════════════════════════════════════════
// City Actions — Server Actions для городов
// Owner only
// ═══════════════════════════════════════════════════════

import { revalidatePath } from 'next/cache';
import { getTokenOrRedirect } from '@/lib/auth';
import CityService from '@/services/city.service';

const CITIES_PATH = '/admins-piruza/owner/cities';

/**
 * Создать город
 * @param {object} prevState
 * @param {FormData} formData - { name }
 */
export async function createCityAction(prevState, formData) {
    const name = formData.get('name')?.trim();

    if (!name) {
        return { success: false, message: 'Название города обязательно' };
    }

    if (name.length < 2) {
        return { success: false, message: 'Минимум 2 символа' };
    }

    try {
        const token = await getTokenOrRedirect();
        await CityService.createCity(token, { name });
        revalidatePath(CITIES_PATH);
        return { success: true, message: 'Город создан' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания' };
    }
}

/**
 * Обновить город
 * @param {object} prevState
 * @param {FormData} formData - { id, name }
 */
export async function updateCityAction(prevState, formData) {
    const id = formData.get('id');
    const name = formData.get('name')?.trim();

    if (!id) {
        return { success: false, message: 'ID города не указан' };
    }

    if (name && name.length < 2) {
        return { success: false, message: 'Минимум 2 символа' };
    }

    try {
        const token = await getTokenOrRedirect();
        await CityService.updateCity(token, id, { name });
        revalidatePath(CITIES_PATH);
        return { success: true, message: 'Город обновлён' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка обновления' };
    }
}

/**
 * Переключить статус города
 * @param {string} id - ID города
 */
export async function toggleCityStatusAction(id) {
    try {
        const token = await getTokenOrRedirect();
        await CityService.toggleStatus(token, id);
        revalidatePath(CITIES_PATH);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка переключения' };
    }
}

/**
 * Удалить город
 * @param {string} id - ID города
 */
export async function deleteCityAction(id) {
    try {
        const token = await getTokenOrRedirect();
        await CityService.deleteCity(token, id);
        revalidatePath(CITIES_PATH);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления' };
    }
}