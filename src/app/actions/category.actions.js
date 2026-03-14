'use server';

import { revalidatePath } from 'next/cache';
import { getTokenOrRedirect } from '@/lib/auth';
import CategoryService from '@/services/category.service';

const CATEGORIES_PATH = '/admins-piruza/owner/categories';

function revalidateSellerPaths(sellerId, sellerSlug) {
    revalidatePath(`/admins-piruza/owner/sellers/${sellerSlug}`);
    revalidatePath(`/admins-piruza/admin-panel/sellers/${sellerSlug}`);
    revalidatePath(`/admins-piruza/manager/sellers/${sellerSlug}`);
}

export async function createGlobalCategoryAction(prevState, formData) {
    const name = formData.get('name')?.trim();
    if (!name) return { success: false, message: 'Название категории обязательно' };
    if (name.length < 2) return { success: false, message: 'Минимум 2 символа' };

    try {
        const token = await getTokenOrRedirect();
        await CategoryService.createGlobalCategory(token, { name });
        revalidatePath(CATEGORIES_PATH);
        return { success: true, message: 'Категория создана' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания' };
    }
}

export async function updateCategoryAction(prevState, formData) {
    const id = formData.get('id');
    const name = formData.get('name')?.trim();
    const isActiveRaw = formData.get('isActive');

    if (!id) return { success: false, message: 'ID категории не указан' };
    if (name && name.length < 2) return { success: false, message: 'Минимум 2 символа' };

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

// ═══════════════════════════════════════════════════════
// Локальные категории продавца
// ═══════════════════════════════════════════════════════

/**
 * Создать локальную категорию продавца
 * @param {object} prevState
 * @param {FormData} formData - { name, sellerId, sellerSlug }
 */
export async function createSellerCategoryAction(prevState, formData) {
    const name = formData.get('name')?.trim();
    const sellerId = formData.get('sellerId');
    const sellerSlug = formData.get('sellerSlug');

    if (!name) return { success: false, message: 'Название обязательно' };
    if (!sellerId) return { success: false, message: 'ID продавца не указан' };

    try {
        const token = await getTokenOrRedirect();
        await CategoryService.createSellerCategory(token, { name, seller: sellerId });
        revalidateSellerPaths(sellerId, sellerSlug);
        return { success: true, message: 'Категория создана' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания' };
    }
}

/**
 * Обновить локальную категорию продавца
 * @param {object} prevState
 * @param {FormData} formData - { id, name, sellerId, sellerSlug }
 */
export async function updateSellerCategoryAction(prevState, formData) {
    const id = formData.get('id');
    const name = formData.get('name')?.trim();
    const sellerId = formData.get('sellerId');
    const sellerSlug = formData.get('sellerSlug');

    if (!id) return { success: false, message: 'ID категории не указан' };
    if (!name) return { success: false, message: 'Название обязательно' };

    try {
        const token = await getTokenOrRedirect();
        await CategoryService.updateCategory(token, id, { name });
        revalidateSellerPaths(sellerId, sellerSlug);
        return { success: true, message: 'Категория обновлена' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка обновления' };
    }
}

/**
 * Удалить локальную категорию продавца
 * @param {string} id
 * @param {string} sellerId
 * @param {string} sellerSlug
 */
export async function deleteSellerCategoryAction(id, sellerId, sellerSlug) {
    try {
        const token = await getTokenOrRedirect();
        await CategoryService.deleteCategory(token, id);
        revalidateSellerPaths(sellerId, sellerSlug);
        return { success: true, message: 'Категория удалена' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления' };
    }
}