import PrivateLoginPage from '@/modules/PrivatePages/PrivateLoginPage/PrivateLoginPage';

// Если уже залогинен — редиректим на нужный dashboard
// Проверка идёт через middleware.js (он пропускает /login без токена)
// Здесь просто рендерим модуль
export const metadata = {
    title: 'Вход | Piruza Admin',
};

const LoginPage = () => {
    return <PrivateLoginPage />;
};

export default LoginPage;