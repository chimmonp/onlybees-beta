// api/organizers/allevents?organizer=[organizerId]

// Import necessary modules
import connectMongo from '@/lib/mongodb';
import Event from '@/models/Event';

export const GET = async (req, res) => {
    try {

        if (req.method !== 'GET') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }
        // Extract organizer ID from req.url using URLSearchParams
        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const organizerId = searchParams.get('organizerId');

        if (!organizerId) {
            return new Response(JSON.stringify({ success: false, error: 'Organizer ID is required' }), { status: 400 });
        }

        // Connect to MongoDB
        await connectMongo();

        // Find all events where organizer matches the provided ID
        const events = await Event.find({ organizer: organizerId }).sort({date: -1});
        if(!events)
            return new Response(JSON.stringify({ success: false, message: 'No Events found' }), { status: 404 });
        
        // Return events as JSON response
        return new Response(JSON.stringify({ success: true, events: events }));

    } catch (error) {
        // Handle errors
        // console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
