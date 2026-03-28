import { redirect } from 'next/navigation';
import CabinetPage from '@/modules/CabinetPage/CabinetPage';
import ClientService from '@/services/client.service';
import CityService from '@/services/city.service';

export default async function Page({ searchParams }) {
    const sp = await searchParams;
    const tab = sp?.tab || 'profile';
    const favPage = Number(sp?.favPage) || 10;
    const ratPage = Number(sp?.ratPage) || 10;

    const [profileRes, favRes, ratRes, citiesRes] = await Promise.allSettled([
        ClientService.getClientProfile(),
        ClientService.getClientFavorites(favPage, 1),
        ClientService.getClientRatingsOwn(ratPage, 1),
        CityService.getActiveCities(1, 100),
    ]);

    console.log('🔍 profileRes status:', profileRes.status);
    if (profileRes.status === 'rejected') {
        console.log('🔍 profileRes error:', profileRes.reason?.message);
    } else {
        console.log('🔍 profile value:', JSON.stringify(profileRes.value)?.substring(0, 100));
    }

    console.log('🔍 ratRes status:', ratRes.status);
    if (ratRes.status === 'rejected') {
        console.log('🔍 ratRes error:', ratRes.reason?.message);
    } else {
        console.log('🔍 ratRes value:', JSON.stringify(ratRes.value)?.substring(0, 200));
    }

    const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
    if (!profile) redirect('/login');

    const favorites = favRes.status === 'fulfilled' ? favRes.value.data || [] : [];
    const favPagination = favRes.status === 'fulfilled' ? favRes.value.pagination || null : null;
    const ratings = ratRes.status === 'fulfilled' ? ratRes.value.data || [] : [];
    const ratPagination = ratRes.status === 'fulfilled' ? ratRes.value.pagination || null : null;
    const cities = citiesRes.status === 'fulfilled' ? citiesRes.value.data || [] : [];

    console.log('🔍 ratPagination:', JSON.stringify(ratPagination));

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