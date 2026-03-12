// ═══════════════════════════════════════════════════════
// Admin Layout — серверный компонент
// Получает профиль с бэкенда, передаёт роль в PrivateLayout
// ═══════════════════════════════════════════════════════

import PrivateLayout from '@/modules/PrivatePages/PrivateLayout/PrivateLayout';
import AuthService from '@/services/auth.service';
import { getToken } from '@/lib/auth';

const AdminLayout = async ({ children }) => {
    const token = await getToken();

    // Нет токена → это страница логина, рендерим без sidebar
    if (!token) {
        return <>{children}</>;
    }

    // Есть токен → получаем профиль с бэкенда
    let profile;

    try {
        profile = await AuthService.getProfile();
    } catch {
        // Токен невалидный → рендерим без sidebar
        // middleware.js перенаправит на логин при следующем запросе
        return <>{children}</>;
    }

    // Профиль получен → оборачиваем в PrivateLayout с sidebar
    return (
        <PrivateLayout role={profile.role} userName={profile.name}>
            {children}
        </PrivateLayout>
    );
};

export default AdminLayout;