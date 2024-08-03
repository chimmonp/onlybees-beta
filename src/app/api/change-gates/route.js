import connectMongo from '@/lib/mongodb';
import DurandTicket from '@/models/DurandTicket';

export const PUT = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Update documents in durandtickets collection
        const updateTickets = await DurandTicket.updateMany(
            { gate: 'G9' },
            { $set: { gate: 'G8' } }
        );

        // Check if updates were successful
        if (updateTickets.modifiedCount === 0) {
            return new Response(JSON.stringify({ success: false, message: 'No documents updated' }), { status: 404 });
        }

        // Return success response
        return new Response(JSON.stringify({ success: true, message: 'Documents updated successfully' }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
