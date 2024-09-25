import connectMongo from '@/lib/mongodb';
import Event from '@/models/Event';
import Order from '@/models/Order';
// import Table from '@/models/Table'; // Import the Table model to fetch ObjectId

export async function POST(req, res) {
    
    try {
        await connectMongo();

        const { orderId, userId, eventId, ticketDetails, status, amount, baseAmt, convenienceFee, platformFee, currency, notes, name, phone, email } = await req.json();
        
        // if (!orderId || !userId || !eventId || !ticketDetails || !status || !amount || !baseAmt || !convenienceFee || !platformFee || !currency || !notes || !name || !phone || !email ) {
        //     return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
        // }

        console.log(orderId, userId, eventId, ticketDetails, status, amount, baseAmt, convenienceFee, platformFee, currency, notes, name, phone, email);

        // Fetch the table ObjectId from the database using the selectedTable identifier
        const event = await Event.findById(eventId);

        if (!event) {
            return new Response(JSON.stringify({ success: false, error: 'Table not found' }), { status: 404 });
        }

        const newOrder = new Order({
            orderId,
            user: userId, // Update this to match your schema
            event: event._id,
            ticketDetails,
            amount,
            baseAmt,
            convenienceFee,
            platformFee,
            currency,
            status,
            notes: { notes },
            name,
            phone,
            email,
        });

        await newOrder.save();

        return new Response(JSON.stringify({ success: true, order: newOrder }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
