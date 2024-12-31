import connectMongo from '@/lib/mongodb';
import Event from '@/models/Event';
import Order from '@/models/Order';

// export const dynamic = 'force-dynamic'

export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Extract the slug from the query parameters
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const eventId = searchParams.get('eventId');

        if (!slug && !eventId) {
            return new Response(JSON.stringify({ success: false, message: 'Slug or ID is required!' }), { status: 400 });
        }

        let event = null;

        if (slug) {
            event = await Event.findOne({ slug });
        } else if (eventId) {
            event = await Event.findById(eventId);
        }

        if (!event) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid Event!' }), { status: 404 });
        }

        const eventObjectId = event._id;

        // Aggregation pipeline to fetch orders with "SUCCESS" status and sum baseAmount and quantity
        const aggregationPipeline = [
            {
                $match: {
                    event: eventObjectId,
                    status: 'SUCCESS'
                }
            },
            {
                $group: {
                    _id: '$_id', // Keep each document distinct
                    baseAmt: { $first: '$baseAmt' }, // Preserve the base amount for this document
                    event: { $first: '$event' }, // Preserve the event ID
                    ticketDetails: { $first: '$ticketDetails' }, // Preserve ticket details
                },
            },
            {
                $group: {
                    _id: '$event', // Group by event
                    totalBaseAmount: { $sum: '$baseAmt' }, // Sum baseAmt correctly
                    ticketDetailsArray: { $push: '$ticketDetails' }, // Collect ticket details arrays
                },
            },
            {
                $unwind: '$ticketDetailsArray', // Unwind the collected ticketDetails arrays
            },
            {
                $unwind: '$ticketDetailsArray', // Unwind each ticket within the arrays
            },
            {
                $group: {
                    _id: '$_id', // Group again by event
                    totalBaseAmount: { $first: '$totalBaseAmount' }, // Preserve the correct totalBaseAmount
                    totalQuantity: { $sum: '$ticketDetailsArray.quantity' }, // Sum the quantities
                },
            },
        ];

        const orderSummary = await Order.aggregate(aggregationPipeline);

        if (!orderSummary.length) {
            return new Response(JSON.stringify({ success: false, message: 'No orders found for this match!' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, data: orderSummary[0] }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
