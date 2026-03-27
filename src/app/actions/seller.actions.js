'use server';

// ═══════════════════════════════════════════════════════
// Seller Actions — Server Actions для продавцов
// ═══════════════════════════════════════════════════════

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getTokenOrRedirect } from '@/lib/auth';
import SellerService from '@/services/seller.service';

const OWNER_SELLERS_PATH = '/admins-piruza/owner/sellers';
const ADMIN_SELLERS_PATH = '/admins-piruza/admin-panel/sellers';

// Revalidate список и детальную страницу для обоих путей
function revalidateSeller(slug) {
    revalidatePath(OWNER_SELLERS_PATH);
    revalidatePath(ADMIN_SELLERS_PATH);
    if (slug) {
        revalidatePath(`${OWNER_SELLERS_PATH}/${slug}`);
        revalidatePath(`${ADMIN_SELLERS_PATH}/${slug}`);
    }
}

// ════════════════════════════════════════
// СОЗДАНИЕ / ОБНОВЛЕНИЕ
// ════════════════════════════════════════

/**
 * Создать продавца
 * @param {object} prevState
 * @param {FormData} formData
 * @returns {{ success, message, slug? }}
 */
export async function createSellerAction(prevState, formData) {
    const name = formData.get('name')?.trim();
    const businessType = formData.get('businessType')?.trim();
    const description = formData.get('description')?.trim();
    const address = formData.get('address')?.trim();
    const phone = formData.get('phone')?.trim();
    const whatsapp = formData.get('whatsapp')?.trim();
    const email = formData.get('email')?.trim();
    const legalInfo = formData.get('legalInfo')?.trim();
    const city = formData.get('city');
    const basePath = formData.get('basePath') || OWNER_SELLERS_PATH;
    const globalCategories = formData.getAll('globalCategories');

    if (!name || !businessType || !description || !address || !phone || !whatsapp || !email || !city) {
        return { success: false, message: 'Заполните все обязательные поля' };
    }

    const body = {
        name, businessType, description, address,
        phone, whatsapp, email, city,
        globalCategories: globalCategories.length ? globalCategories : [],
    };

    if (legalInfo) body.legalInfo = legalInfo;

    let slug;
    try {
        const token = await getTokenOrRedirect();
        const seller = await SellerService.createSeller(token, body);
        slug = seller.slug;
        revalidatePath(OWNER_SELLERS_PATH);
        revalidatePath(ADMIN_SELLERS_PATH);
        revalidatePath('/admins-piruza/manager/sellers');
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания' };
    }

    // redirect() ВНЕ try/catch — иначе NEXT_REDIRECT перехватывается как ошибка
    redirect(`${basePath}/${slug}`);
}

/**
 * Обновить продавца
 * @param {object} prevState
 * @param {FormData} formData
 */
export async function updateSellerAction(prevState, formData) {
    const id = formData.get('id');
    const slug = formData.get('slug');
    const basePath = formData.get('basePath') || OWNER_SELLERS_PATH;
    const name = formData.get('name')?.trim();
    const businessType = formData.get('businessType')?.trim();
    const description = formData.get('description')?.trim();
    const address = formData.get('address')?.trim();
    const phone = formData.get('phone')?.trim();
    const whatsapp = formData.get('whatsapp')?.trim();
    const email = formData.get('email')?.trim();
    const legalInfo = formData.get('legalInfo')?.trim();
    const city = formData.get('city');
    const globalCategories = formData.getAll('globalCategories');

    if (!id) return { success: false, message: 'ID продавца не указан' };

    console.log('📝 [updateSellerAction] id:', id, '| slug:', slug, '| basePath:', basePath, '| name:', name);

    const body = {};
    if (name) body.name = name;
    if (businessType) body.businessType = businessType;
    if (description) body.description = description;
    if (address) body.address = address;
    if (phone) body.phone = phone;
    if (whatsapp) body.whatsapp = whatsapp;
    if (email) body.email = email;
    if (legalInfo) body.legalInfo = legalInfo;
    if (city) body.city = city;
    if (globalCategories.length) body.globalCategories = globalCategories;

    let newSlug;
    try {
        const token = await getTokenOrRedirect();
        const seller = await SellerService.updateSeller(token, id, body);
        console.log('✅ [updateSellerAction] seller.slug:', seller.slug);
        console.log('✅ [updateSellerAction] basePath:', basePath);
        console.log('✅ [updateSellerAction] redirect to:', `${basePath}/${seller.slug}`);
        revalidateSeller(slug);
        if (seller.slug && seller.slug !== slug) {
            revalidateSeller(seller.slug);
        }
        newSlug = seller.slug;
    } catch (err) {
        console.log('❌ [updateSellerAction] error:', err.message);
        return { success: false, message: err.message || 'Ошибка обновления' };
    }

    redirect(`${basePath}/${newSlug}`);
}

// ════════════════════════════════════════
// ЛОГОТИП
// ════════════════════════════════════════

/**
 * Загрузить или заменить лого
 * Автоматически выбирает POST (первая загрузка) или PUT (замена)
 * @param {string} id  — _id продавца
 * @param {string} slug — для revalidate детальной страницы
 * @param {FormData} formData — поле "image"
 * @param {boolean} hasLogo — есть ли уже лого
 */
export async function uploadSellerLogoAction(id, slug, formData, hasLogo) {
    try {
        const token = await getTokenOrRedirect();
        if (hasLogo) {
            await SellerService.replaceSellerLogo(token, id, formData);
        } else {
            await SellerService.uploadSellerLogo(token, id, formData);
        }
        revalidateSeller(slug);
        return { success: true, message: hasLogo ? 'Лого заменено' : 'Лого загружено' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка загрузки лого' };
    }
}

/**
 * Удалить лого
 * @param {string} id
 * @param {string} slug
 */
export async function deleteSellerLogoAction(id, slug) {
    try {
        const token = await getTokenOrRedirect();
        await SellerService.deleteSellerLogo(token, id);
        revalidateSeller(slug);
        return { success: true, message: 'Лого удалено' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления лого' };
    }
}

// ════════════════════════════════════════
// ОБЛОЖКА
// ════════════════════════════════════════

/**
 * Загрузить или заменить обложку
 * @param {string} id
 * @param {string} slug
 * @param {FormData} formData
 * @param {boolean} hasCover
 */
export async function uploadSellerCoverAction(id, slug, formData, hasCover) {
    try {
        const token = await getTokenOrRedirect();
        if (hasCover) {
            await SellerService.replaceSellerCover(token, id, formData);
        } else {
            await SellerService.uploadSellerCover(token, id, formData);
        }
        revalidateSeller(slug);
        return { success: true, message: hasCover ? 'Обложка заменена' : 'Обложка загружена' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка загрузки обложки' };
    }
}

/**
 * Удалить обложку
 * @param {string} id
 * @param {string} slug
 */
export async function deleteSellerCoverAction(id, slug) {
    try {
        const token = await getTokenOrRedirect();
        await SellerService.deleteSellerCover(token, id);
        revalidateSeller(slug);
        return { success: true, message: 'Обложка удалена' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления обложки' };
    }
}

// ════════════════════════════════════════
// УПРАВЛЕНИЕ СТАТУСАМИ
// ════════════════════════════════════════

/**
 * Активировать продавца (Owner/Admin — устанавливает даты)
 * @param {string} id
 * @param {number|null} months
 * @param {string} slug
 */
export async function activateSellerAction(id, months = null, slug = null) {
    try {
        const token = await getTokenOrRedirect();
        await SellerService.activateSeller(token, id, months);
        revalidateSeller(slug);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка активации' };
    }
}

export async function activateSellerManagerAction(sellerId, sellerSlug) {
    try {
        const token = await getTokenOrRedirect();
        await SellerService.activateSellerManager(token, sellerId);
        revalidatePath(`/admins-piruza/manager/sellers/${sellerSlug}`);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

/**
 * Продлить продавца (Owner/Admin)
 * @param {string} id
 * @param {number} months
 * @param {string} slug
 */
export async function extendSellerAction(id, months, slug = null) {
    if (!months || months < 1) {
        return { success: false, message: 'Минимум 1 месяц' };
    }

    try {
        const token = await getTokenOrRedirect();
        await SellerService.extendSeller(token, id, months);
        revalidateSeller(slug);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка продления' };
    }
}

/**
 * Деактивировать продавца (Owner/Admin)
 * @param {string} id
 * @param {string} slug
 */
export async function deactivateSellerAction(id, slug = null) {
    try {
        const token = await getTokenOrRedirect();
        await SellerService.deactivateSeller(token, id);
        revalidateSeller(slug);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка деактивации' };
    }
}

/**
 * Перевести в draft
 * @param {string} id
 * @param {string} slug
 */
export async function moveToDraftAction(id, slug = null) {
    try {
        const token = await getTokenOrRedirect();
        await SellerService.moveToDraft(token, id);
        revalidateSeller(slug);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка перевода в draft' };
    }
}

/**
 * Удалить продавца
 * @param {string} id
 */
export async function deleteSellerAction(id, slug = null) {
    try {
        const token = await getTokenOrRedirect();
        await SellerService.deleteSeller(token, id);
        revalidateSeller(slug);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка удаления' };
    }
}