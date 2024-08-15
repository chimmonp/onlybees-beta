import connectMongo from '@/lib/mongodb';
import DurandTicket from '@/models/DurandTicket';

// export const dynamic = 'force-dynamic'

export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Extract the slug from the query parameters
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const ticketId = searchParams.get('ticketId')
        // console.log(eventId)

        if (!slug && !ticketId) {
            return new Response(JSON.stringify({ success: false, message: 'Slug or ID is required!' }), { status: 400 });
        }

        let ticket = null;

        if (slug) {
            ticket = await DurandTicket.findOne({ slug });
        }

        else if (ticketId) {
            ticket = await DurandTicket.findById(ticketId);
        }

        // Fetch event from the database
        // const event = await Event.findOne({ identifier });

        if (!ticket) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid Ticket!' }), { status: 404 });
        }

        // Return the event in the response
        return new Response(JSON.stringify({ success: true, data: ticket }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}