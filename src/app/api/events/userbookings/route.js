// src/api/events/userbookings.js
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';  // Assume you have a Booking model

export const dynamic = 'force-dynamic'

export async function GET(req) {
    try {
        await connectMongo();

        // const { userId, eventId } = req.query;

        // Extract the slug from the query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const eventId = searchParams.get('eventId')

        if (!userId || !eventId) {
            return new Response(JSON.stringify({ success: false, message: 'Missing parameters' }), { status: 400 });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
        }

        // Filter the user's bookings for the specific event
        const bookingsForEvent = user.bookings.filter(booking => booking.eventId.toString() === eventId);

        if (bookingsForEvent.length === 0) {
            return new Response(JSON.stringify({ success: false, message: 'No bookings found for this event' }), { status: 404 });
        }

        // Calculate the total tickets booked
        const totalTicketsBooked = bookingsForEvent.reduce((acc, booking) => acc + booking.ticketDetails.reduce((sum, ticket) => sum + ticket.quantity, 0), 0);

        return new Response(JSON.stringify({ success: true, bookings: totalTicketsBooked, details: bookingsForEvent }), { status: 200 });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
    }
}