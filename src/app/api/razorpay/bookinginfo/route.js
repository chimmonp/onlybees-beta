import connectMongo from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export const dynamic = 'force-dynamic'

export const GET = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Extract the slug from the query parameters
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId')

        if (!orderId) {
            return new Response(JSON.stringify({ success: false, message: 'ID is required!' }), { status: 400 });
        }
        
        const order = await Order.findById(orderId);

        if (!order) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid Order!' }), { status: 404 });
        }

        // Return the event in the response
        return new Response(JSON.stringify({ success: true, data: order }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
