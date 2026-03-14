'use server';

// ═══════════════════════════════════════════════════════
// Product Actions — Server Actions для товаров
// ═══════════════════════════════════════════════════════

import { revalidatePath } from 'next/cache';
import { getTokenOrRedirect } from '@/lib/auth';
import ProductService from '@/services/product.service';

// Revalidate детальной страницы продавца (где показаны товары)
function revalidateSellerDetail(sellerSlug) {
    revalidatePath(`/admins-piruza/owner/sellers/${sellerSlug}`);
    revalidatePath(`/admins-piruza/admin-panel/sellers/${sellerSlug}`);
    revalidatePath(`/admins-piruza/manager/sellers/${sellerSlug}`);
}

// ════════════════════════════════════════
// СОЗДАНИЕ / ОБНОВЛЕНИЕ
// ════════════════════════════════════════

/**
 * Создать товар
 * @param {object} prevState
 * @param {FormData} formData
 * formData поля: name, sellerId, sellerSlug, categoryId?, price?, description?, code?, isAvailable?
 */
export async function createProductAction(prevState, formData) {
    const name = formData.get('name')?.trim();
    const sellerId = formData.get('sellerId');
    const sellerSlug = formData.get('sellerSlug');
    const categoryId = formData.get('categoryId');
    const price = formData.get('price');
    const description = formData.get('description')?.trim();
    const code = formData.get('code')?.trim();
    const isAvailable = formData.get('isAvailable');

    if (!name) return { success: false, message: 'Название товара обязательно' };
    if (!sellerId) return { success: false, message: 'ID продавца не указан' };

    const body = {
        name,
        seller: sellerId,
    };

    if (categoryId) body.category = categoryId;
    if (price) body.price = Number(price);
    if (description) body.description = description;
    if (code) body.code = code;
    if (isAvailable !== null && isAvailable !== undefined) {
        body.isAvailable = isAvailable === 'true';
    }

    try {
        const token = await getTokenOrRedirect();
        await ProductService.createProduct(token, body);
        revalidateSellerDetail(sellerSlug);
        return { success: true, message: 'Товар создан' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания товара' };
    }
}

/**
 * Обновить товар
 * @param {object} prevState
 * @param {FormData} formData
 * formData поля: id, sellerSlug, name?, categoryId?, price?, description?, code?, isAvailable?
 */
export async function updateProductAction(prevState, formData) {
    const id = formData.get('id');
    const sellerSlug = formData.get('sellerSlug');
    const name = formData.get('name')?.trim();
    const categoryId = formData.get('category') || formData.get('categoryId');
    const price = formData.get('price');
    const description = formData.get('description')?.trim();
    const code = formData.get('code')?.trim();
    const isAvailable = formData.get('isAvailable');

    if (!id) return { success: false, message: 'ID товара не указан' };

    const body = {};
    if (name) body.name = name;
    if (categoryId) body.category = categoryId;
    if (price !== null && price !== '') body.price = Number(price);
    if (description !== null && description !== '') body.description = description;
    if (code) body.code = code;
    if (isAvailable !== null && isAvailable !== undefined) {
        body.isAvailable = isAvailable === 'true';
    }

    try {
        const token = await getTokenOrRedirect();
        const result = await ProductService.updateProduct(token, id, body);
        revalidateSellerDetail(sellerSlug);
        // Инвалидируем страницу продукта (slug мог измениться)
        revalidatePath(`/admins-piruza/owner/sellers/${sellerSlug}/products/${result.slug}`);
        revalidatePath(`/admins-piruza/admin-panel/sellers/${sellerSlug}/products/${result.slug}`);
        revalidatePath(`/admins-piruza/manager/sellers/${sellerSlug}/products/${result.slug}`);
        return { success: true, message: 'Товар обновлён', slug: result.slug };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка обновления товара' };
    }
}

/**
 * Удалить товар
 * @param {string} id
 * @param {string} sellerSlug
 */
export async function deleteProductAction(id, sellerSlug) {
    try {
        const token = await getTokenOrRedirect();
        await ProductService.deleteProduct(token, id);
        revalidateSellerDetail(sellerSlug);
        return { success: true, message: 'Товар удалён' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления товара' };
    }
}

// ════════════════════════════════════════
// ИЗОБРАЖЕНИЯ ТОВАРА
// ════════════════════════════════════════

/**
 * Загрузить или заменить изображение товара
 * Автоматически выбирает POST (первая загрузка) или PUT (замена)
 * @param {string} id         — _id товара
 * @param {string} sellerSlug — для revalidate
 * @param {FormData} formData — поле "image"
 * @param {boolean} hasImage  — есть ли уже изображение
 */
export async function uploadProductImageAction(id, sellerSlug, formData, hasImage) {
    try {
        const token = await getTokenOrRedirect();
        if (hasImage) {
            await ProductService.replaceProductImage(token, id, formData);
        } else {
            await ProductService.uploadProductImage(token, id, formData);
        }
        revalidateSellerDetail(sellerSlug);
        return { success: true, message: hasImage ? 'Изображение заменено' : 'Изображение загружено' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка загрузки изображения' };
    }
}

/**
 * Удалить изображение товара
 * @param {string} id
 * @param {string} sellerSlug
 */
export async function deleteProductImageAction(id, sellerSlug) {
    try {
        const token = await getTokenOrRedirect();
        await ProductService.deleteProductImage(token, id);
        revalidateSellerDetail(sellerSlug);
        return { success: true, message: 'Изображение удалено' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления изображения' };
    }
}