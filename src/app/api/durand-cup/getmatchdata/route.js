import connectMongo from '@/lib/mongodb';
import Match from '@/models/Match';

// export const dynamic = 'force-dynamic'

export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Extract the slug from the query parameters
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const matchId = searchParams.get('matchId')
        // console.log(eventId)

        if (!slug && !matchId) {
            return new Response(JSON.stringify({ success: false, message: 'Slug or ID is required!' }), { status: 400 });
        }

        let match = null;

        if (slug) {
            match = await Match.findOne({ slug });
        }

        else if (matchId) {
            match = await Match.findById(matchId);
        }

        // Fetch event from the database
        // const event = await Event.findOne({ identifier });

        if (!match) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid Event!' }), { status: 404 });
        }

        // Return the event in the response
        return new Response(JSON.stringify({ success: true, data: match }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}