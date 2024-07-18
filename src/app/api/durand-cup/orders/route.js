import connectMongo from '@/lib/mongodb';
import Match from '@/models/Match';
import DurandOrder from '@/models/DurandOrder';
import Section from '@/models/Section';

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

        // Create aggregation pipeline to get orders and their section information
        const ordersWithSections = await DurandOrder.aggregate([
            { $match: { match: match._id } },
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
                $project: {
                    'sectionInfo.availableQuantity': 0
                }
            }
        ]).exec();

        // Return the orders with section information in the response
        return new Response(JSON.stringify({ success: true, orders: ordersWithSections, match }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
