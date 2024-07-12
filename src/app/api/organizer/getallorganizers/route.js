// api/organizers/getallorganizers.js

// Import necessary modules
import connectMongo from '@/lib/mongodb';
import Organizer from '@/models/Organizer';

// Define the GET handler function
export const GET = async (req) => {
    try {
        // Ensure the request method is GET
        if (req.method !== 'GET') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        // Connect to MongoDB
        await connectMongo();

        // Fetch all organizers
        const organizers = await Organizer.find();

        // Return the list of organizers
        return new Response(JSON.stringify({ success: true, organizers }), { status: 200 });

    } catch (error) {
        console.error('Error fetching organizers:', error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
