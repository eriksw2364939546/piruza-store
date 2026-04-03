'use server';

import { getClientTokenOrRedirect } from '@/lib/auth';
import { apiWithAuth, apiPatch } from '@/lib/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import ClientService from '@/services/client.service';

export async function toggleClientActiveAction(clientId) {
    try {
        const data = await ClientService.toggleClientActive(clientId);
        revalidatePath('/admins-piruza/owner/clients');
        return { success: true, data };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

export async function toggleFavoriteAction(sellerId) {
    try {
        const token = await getClientTokenOrRedirect();
        await apiWithAuth(`/api/clients/favorites/${sellerId}`, token, { method: 'POST' });
        revalidatePath('/cabinet');
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

export async function updateClientCityAction(cityId) {
    try {
        const token = await getClientTokenOrRedirect();
        await apiPatch('/api/clients/city', token, { city: cityId });
        revalidatePath('/cabinet');
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

export async function logoutClientAction() {
    const cookieStore = await cookies();
    cookieStore.delete('client_token');
    redirect('/login');
}

export async function deleteClientAction(clientId) {
    try {
        await ClientService.deleteClient(clientId);
        revalidatePath('/admins-piruza/owner/clients');
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
}