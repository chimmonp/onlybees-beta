import SeatingClientComponent from '../../components/SeatingClientComponent';
import { cache } from 'react';

const fetchAllSections = cache(async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/durand-cup/allsections`, {
            next: { revalidate: 0 }
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        return data.sections;
    } catch (error) {
        console.error('Error fetching all Sections:', error);
        return [];
    }
});

const fetchMatchData = cache(async (slugEnd) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/durand-cup/getmatchdata?slug=${slugEnd}`, {
            next: { revalidate: 0 }
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching match data:', error);
        return {};
    }
});

const SeatingPage = async ({ params }) => {
    const { slug } = params;

    const initialSections = await fetchAllSections();
    const initialMatchDetails = await fetchMatchData(slug);

    return (
        <SeatingClientComponent 
            initialSections={initialSections} 
            initialMatchDetails={initialMatchDetails} 
            slugEnd={slug} 
        />
    );
};

export default SeatingPage;
