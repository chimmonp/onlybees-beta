import connectMongo from '@/lib/mongodb';
import Match from '@/models/Match';


export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();


        const matches = await Match.find();

        // Fetch event from the database
        // const event = await Event.findOne({ identifier });

        if (!matches) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid!' }), { status: 404 });
        }

        // Return the event in the response
        return new Response(JSON.stringify({ success: true, matches: matches }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}