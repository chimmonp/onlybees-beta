import connectMongo from '@/lib/mongodb';
import Section from '@/models/Section';


export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();


        const sections = await Section.find();

        // Fetch event from the database
        // const event = await Event.findOne({ identifier });

        if (!sections) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid Event!' }), { status: 404 });
        }

        // Return the event in the response
        return new Response(JSON.stringify({ success: true, sections: sections }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}