'use server';

// ═══════════════════════════════════════════════════════
// Request Actions — Server Actions для заявок
// ═══════════════════════════════════════════════════════

import { revalidatePath } from 'next/cache';
import { getTokenOrRedirect } from '@/lib/auth';
import RequestService from '@/services/request.service';

function revalidateRequests() {
    revalidatePath('/admins-piruza/owner/requests');
    revalidatePath('/admins-piruza/admin-panel/requests');
    revalidatePath('/admins-piruza/manager/requests');
    revalidatePath('/admins-piruza/manager/sellers');
}

/**
 * Создать заявку (Manager)
 */
export async function createRequestAction(prevState, formData) {
    const name = formData.get('name')?.trim();
    const businessType = formData.get('businessType')?.trim();
    const legalInfo = formData.get('legalInfo')?.trim();

    if (!name) return { success: false, message: 'Название обязательно' };
    if (!businessType) return { success: false, message: 'Тип бизнеса обязателен' };
    if (!legalInfo) return { success: false, message: 'Юридические данные обязательны (мин. 5 символов)' };

    try {
        const token = await getTokenOrRedirect();
        await RequestService.createRequest(token, { name, businessType, legalInfo });
        revalidateRequests();
        return { success: true, message: 'Заявка отправлена! Ожидайте одобрения.' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка создания заявки' };
    }
}

/**
 * Одобрить заявку (Owner / Admin)
 */
export async function approveRequestAction(id) {
    try {
        const token = await getTokenOrRedirect();
        await RequestService.approveRequest(token, id);
        revalidateRequests();
        return { success: true, message: 'Заявка одобрена' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка одобрения' };
    }
}

/**
 * Отклонить заявку (Owner / Admin)
 */
export async function rejectRequestAction(prevState, formData) {
    const id = formData.get('id');
    const rejectionReason = formData.get('rejectionReason')?.trim();

    if (!id) return { success: false, message: 'ID заявки не указан' };
    if (!rejectionReason) return { success: false, message: 'Укажите причину отклонения' };

    try {
        const token = await getTokenOrRedirect();
        await RequestService.rejectRequest(token, id, rejectionReason);
        revalidateRequests();
        return { success: true, message: 'Заявка отклонена' };
    } catch (err) {
        return { success: false, message: err.message || 'Ошибка отклонения' };
    }
}