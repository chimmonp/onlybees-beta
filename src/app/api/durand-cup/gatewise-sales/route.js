import connectMongo from '@/lib/mongodb';
import Match from '@/models/Match';
import DurandOrder from '@/models/DurandOrder';
import Section from '@/models/Section';
import DurandTicket from '@/models/DurandTicket';

export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        // Check if slug is provided
        if (!slug) {
            return new Response(JSON.stringify({ success: false, error: 'Match slug is required' }), { status: 400 });
        }

        // Find the match with the given slug
        const match = await Match.findOne({ slug }).exec();

        if (!match) {
            return new Response(JSON.stringify({ success: false, error: 'Match not found' }), { status: 404 });
        }

        // Create aggregation pipeline to get orders with status "SUCCESS", their section information, and tickets
        const ordersWithSectionsAndTickets = await DurandOrder.aggregate([
            { $match: { match: match._id, status: "SUCCESS" } },
            {
                $lookup: {
                    from: 'sections',
                    localField: 'section',
                    foreignField: '_id',
                    as: 'sectionInfo'
                }
            },
            {
                $unwind: {
                    path: '$sectionInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'durandtickets',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'ticket'
                }
            },
            {
                $unwind: {
                    path: '$ticket',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: {
                        gate: '$ticket.gate',
                        bowl: '$ticket.bowl'
                    },
                    totalQuantity: { $sum: '$ticket.quantity' }
                }
            }
        ]).exec();

        // Format the result to include gate and bowl separately
        const formattedResult = ordersWithSectionsAndTickets.map(item => ({
            gate: item._id.gate,
            bowl: item._id.bowl,
            totalQuantity: item.totalQuantity
        }));

        // Return the formatted result in the response
        return new Response(JSON.stringify({
            success: true,
            data: formattedResult
        }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
