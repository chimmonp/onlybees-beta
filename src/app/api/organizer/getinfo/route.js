import connectMongo from '@/lib/mongodb';
import Organizer from '@/models/Organizer';

export const GET = async (req) => {
    try {
        // Ensure the request method is GET
        if (req.method !== 'GET') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const organizerId = searchParams.get('organizerId');
        // Check if eventId is provided
        if (!organizerId) {
            return new Response(JSON.stringify({ success: false, error: 'Organizer ID is required' }), { status: 400 });
        }

        // Parse page and limit parameters
        // let page = parseInt(searchParams.get('page') || '1', 10);
        // let limit = parseInt(searchParams.get('limit') || '10', 10);

        // Connect to MongoDB
        await connectMongo();

        // Find the event by ID to verify and populate event details in bookings
        const organizer = await Organizer.findById(organizerId);
        if (!organizer) {
            return new Response(JSON.stringify({ success: false, message: 'Event not found' }), { status: 404 });
        }

        // Return organizer data
        return new Response(JSON.stringify({
            success: true,
            organizer
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
