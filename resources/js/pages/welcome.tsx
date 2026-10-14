import { Head } from '@inertiajs/react';
import NgoApp from '@/ngo/App';
import { resolveActivityImage } from '@/ngo/data/siteData';
import type { ActivityItem, FocusAreaItem, SiteSettings } from '@/ngo/data/siteData';

type WelcomeProps = {
    activities: ActivityItem[];
    focusAreas: FocusAreaItem[];
    settings: SiteSettings;
};

export default function Welcome({ activities, focusAreas, settings }: WelcomeProps) {
    const items = activities.map((activity) => ({
        ...activity,
        image: resolveActivityImage(activity.image),
    }));

    return (
        <>
            <Head title="Gita Helping Hearts Nepal" />
            <NgoApp activities={items} focusAreas={focusAreas} settings={settings} />
        </>
    );
}
