import connectMongo from '@/lib/mongodb';
import Section from '@/models/Section';

// export const dynamic = 'force-dynamic'

export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Extract the slug from the query parameters
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const sectionId = searchParams.get('sectionId')
        // console.log(eventId)

        if (!slug && !sectionId) {
            return new Response(JSON.stringify({ success: false, message: 'Slug or ID is required!' }), { status: 400 });
        }

        let section = null;

        if (slug) {
            section = await Section.findOne({ slug });
        }

        else if (sectionId) {
            section = await Section.findById(sectionId);
        }

        // Fetch event from the database
        // const event = await Event.findOne({ identifier });

        if (!section) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid Event!' }), { status: 404 });
        }

        // Return the event in the response
        return new Response(JSON.stringify({ success: true, data: section }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}