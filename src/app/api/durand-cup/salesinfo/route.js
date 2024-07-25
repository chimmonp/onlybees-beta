import connectMongo from '@/lib/mongodb';
import Match from '@/models/Match';
import DurandOrder from '@/models/DurandOrder';

// export const dynamic = 'force-dynamic'

export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Extract the slug from the query parameters
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const matchId = searchParams.get('matchId');

        if (!slug && !matchId) {
            return new Response(JSON.stringify({ success: false, message: 'Slug or ID is required!' }), { status: 400 });
        }

        let match = null;

        if (slug) {
            match = await Match.findOne({ slug });
        } else if (matchId) {
            match = await Match.findById(matchId);
        }

        if (!match) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid Match!' }), { status: 404 });
        }

        const matchObjectId = match._id;

        // Aggregation pipeline to fetch orders with "SUCCESS" status and sum baseAmount and quantity
        const aggregationPipeline = [
            {
                $match: {
                    match: matchObjectId,
                    status: 'SUCCESS'
                }
            },
            {
                $group: {
                    _id: '$match',
                    totalBaseAmount: { $sum: '$baseAmount' },
                    totalQuantity: { $sum: '$quantity' }
                }
            }
        ];

        const orderSummary = await DurandOrder.aggregate(aggregationPipeline);

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
