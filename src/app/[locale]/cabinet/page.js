import { redirect } from 'next/navigation';
import CabinetPage from '@/modules/CabinetPage/CabinetPage';
import ClientService from '@/services/client.service';
import CityService from '@/services/city.service';

export default async function Page({ searchParams }) {
    const sp = await searchParams;
    const tab = sp?.tab || 'profile';
    const favPage = Number(sp?.favPage) || 1;
    const ratPage = Number(sp?.ratPage) || 1;

    const [profileRes, favRes, ratRes, citiesRes] = await Promise.allSettled([
        ClientService.getClientProfile(),
        ClientService.getClientFavorites(favPage, 10),
        ClientService.getClientRatingsOwn(ratPage, 10),
        CityService.getActiveCities(1, 100),
    ]);



    const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
    if (!profile) redirect('/login');

    const favorites = favRes.status === 'fulfilled' ? favRes.value.data || [] : [];
    const favPagination = favRes.status === 'fulfilled' ? favRes.value.pagination || null : null;
    const ratings = ratRes.status === 'fulfilled' ? ratRes.value.data || [] : [];
    const ratPagination = ratRes.status === 'fulfilled' ? ratRes.value.pagination || null : null;
    const cities = citiesRes.status === 'fulfilled' ? citiesRes.value.data || [] : [];


    return (
        <CabinetPage
            profile={profile}
            favorites={favorites}
            favPagination={favPagination}
            ratings={ratings}
            ratPagination={ratPagination}
            cities={cities}
            initialTab={tab}
            initialFavPage={favPage}
            initialRatPage={ratPage}
        />
    );
}