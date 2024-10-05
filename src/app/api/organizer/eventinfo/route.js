import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order'; // Assuming you have an Order model
import Event from '@/models/Event'; // Assuming you have an Event model
import Ticket from '@/models/Ticket'; // Assuming you have a Ticket model

export const GET = async (req) => {
    try {
        // Ensure the request method is GET
        if (req.method !== 'GET') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        // Extract query parameters
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get('eventId');
        // Check if eventId is provided
        if (!eventId) {
            return new Response(JSON.stringify({ success: false, error: 'Event ID is required' }), { status: 400 });
        }

        // Parse page and limit parameters
        // let page = parseInt(searchParams.get('page') || '1', 10);
        // let limit = parseInt(searchParams.get('limit') || '10', 10);

        // Connect to MongoDB
        await connectMongo();

        // Find the event by ID to verify and populate event details in bookings
        const event = await Event.findById(eventId);
        if (!event) {
            return new Response(JSON.stringify({ success: false, message: 'Event not found' }), { status: 404 });
        }

        // Aggregate pipeline to fetch bookings with tickets for the specified event
        const pipeline = [
            {
                $match: { 
                    event: event._id, 
                    status: { $in: ['created', 'SUCCESS'] } // Filter orders with status 'created' or 'SUCCESS'
                }
            },
            {
                $lookup: {
                    from: 'tickets', // Name of the Ticket collection
                    localField: '_id', // Field in Order collection
                    foreignField: 'orderId', // Field in Ticket collection
                    as: 'tickets'
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    event: 1,
                    amount: 1,
                    orderId: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    status: 1,
                    createdAt: 1,
                    ticket: '$tickets'
                }
            }
        ];

        // Execute aggregation pipeline
        const bookings = await Order.aggregate(pipeline);
        // const totalEntries = await Order.countDocuments({ event: eventId });
        const totalEntries = bookings.length;

        // Calculate total sales amount
        const totalSalesAmount = await Order.aggregate([
            { $match: { event: event._id } },
            { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
        ]);

        // Calculate total ticket numbers
        const totalTicketNumbers = await Ticket.aggregate([
            { $match: { event: event._id } },
            { $unwind: '$ticketDetails' },
            { $group: { _id: null, totalQuantity: { $sum: '$ticketDetails.quantity' } } }
        ]);

        // Calculate total check-ins
        const totalCheckIns = await Ticket.countDocuments({ event: event._id, isUsed: true });



        // Return bookings data
        return new Response(JSON.stringify({
            success: true,
            orders: bookings,
            totalEntries,
            totalSalesAmount: totalSalesAmount[0]?.totalAmount || 0,
            totalTicketNumbers: totalTicketNumbers[0]?.totalQuantity || 0,
            totalCheckIns,
            event
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
