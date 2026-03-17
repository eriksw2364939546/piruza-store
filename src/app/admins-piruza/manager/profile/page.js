// src/app/admins-piruza/manager/profile/page.js

import ProfilePage from '@/modules/PrivatePages/ProfilePage/ProfilePage';
import AuthService from '@/services/auth.service';

export default async function Page() {
    let profile = null;

    try {
        profile = await AuthService.getProfile();
    } catch {
        profile = null;
    }

    if (!profile) return <div>Ошибка загрузки профиля</div>;

    return <ProfilePage profile={profile} />;
}