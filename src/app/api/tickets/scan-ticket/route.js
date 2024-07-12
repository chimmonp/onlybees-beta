// src/pages/api/tickets/mark.js
import connectMongo from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export const POST = async (req) => {
    try {
        // Ensure the request method is POST
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        // Parse the request body to get the ticket ID
        const { ticketId } = await req.json();

        // Connect to MongoDB
        await connectMongo();

        // Find the ticket by ID and update its isUsed status to true
        const ticket = await Ticket.findById(ticketId);
        if (ticket.isUsed) {
            return new Response(JSON.stringify({ success: false, error: 'Ticket already used!' }), { status: 410 });
        }
        // const ticket = await Ticket.findByIdAndUpdate(ticketId, { isUsed: true }, { new: true });

        // Check if the ticket was found and updated
        if (!ticket) {
            return new Response(JSON.stringify({ success: false, message: 'Ticket not found' }), { status: 404 });
        }

        // Update the isUsed status to true
        ticket.isUsed = true;
        await ticket.save();

        // Return a success response
        return new Response(JSON.stringify({ success: true, message: 'Ticket marked as used', ticket }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};

