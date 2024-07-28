// src/pages/api/tickets/get-details.js

import connectMongo from '@/lib/mongodb';
import DurandTicket from '@/models/DurandTicket';
import User from '@/models/User';
import Match from '@/models/Match';

export const GET = async (req) => {
    try {
        // Ensure the request method is GET
        if (req.method !== 'GET') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        // Extract query parameters
        const url = new URL(req.url);
        const ticketId = url.searchParams.get('ticketId');

        // Connect to MongoDB
        await connectMongo();

        // Find the ticket by ID and return its details
        const ticket = await DurandTicket.findById(ticketId);

        // Check if the ticket was found
        if (!ticket) {
            return new Response(JSON.stringify({ success: false, message: 'Ticket not found' }), { status: 404 });
        }

        // console.log(ticket.user)

        const match = await Match.findById(ticket.match);
        const user = await User.findById(ticket.user);

        // console.log("User : \n", user)
        // console.log("Match : \n", match)
        // console.log("Ticket : \n", ticket)

        // Return ticket details
        return new Response(JSON.stringify({ success: true, ticket, user, match }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
