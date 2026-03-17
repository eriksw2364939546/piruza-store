'use server';

import ClientService from '@/services/client.service';
import { revalidatePath } from 'next/cache';

export async function toggleClientActiveAction(clientId) {
    try {
        const data = await ClientService.toggleClientActive(clientId);
        revalidatePath('/admins-piruza/owner/clients');
        return { success: true, data };
    } catch (err) {
        return { success: false, message: err.message };
    }
}