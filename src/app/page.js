import { redirect } from 'next/navigation';
import WelcomePage from '@/modules/WelcomePage/WelcomePage';
import CityService from '@/services/city.service';

async function getSiteMode() {
    try {
        const res = await fetch(
            `${process.env.API_URL}/api/settings/site-mode`,
            { cache: 'no-store' }
        );
        const json = await res.json();
        return json.data?.mode || 'coming_soon';
    } catch {
        return 'coming_soon';
    }
}

export default async function RootPage() {
    const mode = await getSiteMode();

    if (mode === 'live') {
        redirect('/fr');
    }

    let cities = [];
    try {
        const res = await CityService.getActiveCities(1, 100);
        cities = res?.data || [];
    } catch {
        cities = [];
    }

    return <WelcomePage cities={cities} />;
}