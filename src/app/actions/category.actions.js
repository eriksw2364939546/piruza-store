'use server';

// ═══════════════════════════════════════════════════════
// Category Actions — Server Actions для категорий
// ═══════════════════════════════════════════════════════

import { revalidatePath } from 'next/cache';
import { getTokenOrRedirect } from '@/lib/auth';
import CategoryService from '@/services/category.service';

const CATEGORIES_PATH = '/admins-piruza/owner/categories';

/**
 * Создать глобальную категорию
 * Owner only
 * @param {object} prevState
 * @param {FormData} formData - { name }
 */
export async function createGlobalCategoryAction(prevState, formData) {
    const name = formData.get('name')?.trim();

    if (!name) {
        return { success: false, message: 'Название категории обязательно' };
    }

    if (name.length < 2) {
        return { success: false, message: 'Минимум 2 символа' };
    }

    try {
        const token = await getTokenOrRedirect();
        await CategoryService.createGlobalCategory(token, { name });
        revalidatePath(CATEGORIES_PATH);
        return { success: true, message: 'Категория создана' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания' };
    }
}

/**
 * Обновить категорию (название, описание, статус)
 * @param {object} prevState
 * @param {FormData} formData - { id, name, isActive }
 */
export async function updateCategoryAction(prevState, formData) {
    const id = formData.get('id');
    const name = formData.get('name')?.trim();
    const isActiveRaw = formData.get('isActive');

    if (!id) {
        return { success: false, message: 'ID категории не указан' };
    }

    if (name && name.length < 2) {
        return { success: false, message: 'Минимум 2 символа' };
    }

    const body = {};
    if (name) body.name = name;
    if (isActiveRaw !== null) body.isActive = isActiveRaw === 'true';

    try {
        const token = await getTokenOrRedirect();
        await CategoryService.updateCategory(token, id, body);
        revalidatePath(CATEGORIES_PATH);
        return { success: true, message: 'Категория обновлена' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка обновления' };
    }
}

/**
 * Переключить статус категории (active/inactive)
 * @param {string} id
 * @param {boolean} currentStatus
 */
export async function toggleCategoryStatusAction(id, currentStatus) {
    try {
        const token = await getTokenOrRedirect();
        await CategoryService.updateCategory(token, id, { isActive: !currentStatus });
        revalidatePath(CATEGORIES_PATH);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка переключения' };
    }
}

/**
 * Удалить категорию
 * @param {string} id
 */
export async function deleteCategoryAction(id) {
    try {
        const token = await getTokenOrRedirect();
        await CategoryService.deleteCategory(token, id);
        revalidatePath(CATEGORIES_PATH);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления' };
    }
}
