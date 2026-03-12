// ═══════════════════════════════════════════════════════
// /admins-piruza — умный редирект по роли
// ═══════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import AuthService from '@/services/auth.service';

const ROLE_REDIRECTS = {
    owner: '/admins-piruza/owner',
    admin: '/admins-piruza/admin-panel',
    manager: '/admins-piruza/manager',
};

const AdminIndexPage = async () => {
    let profile;

    try {
        profile = await AuthService.getProfile();
    } catch {
        // Токен невалидный → на логин
        redirect('/admins-piruza/login');
    }

    const destination = ROLE_REDIRECTS[profile.role];

    if (!destination) {
        redirect('/admins-piruza/login');
    }

    redirect(destination);
};

export default AdminIndexPage;