import connectMongo from '@/lib/mongodb';
import razorpay from '@/lib/razorpay';
import DurandOrder from '@/models/DurandOrder';
import User from '@/models/User';

export const POST = async (req, res) => {
    try {
        await connectMongo();

        // const { userId, eventId, ticketDetails, amount, currency, receipt, notes } = await req.json();
        const { transactionId, userId, match, status, amount, baseAmount, quantity, section, currency, notes, name, phone, email } = await req.json();

        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            // receipt: '12dasf3dfs3012412',
            notes,
        };

        const order = await razorpay.orders.create(options);

        const newOrder = new DurandOrder({
            // user: userId,
            // event: eventId,
            // amount,
            // currency,
            // receipt,
            // orderId: order.id,
            // notes,
            orderId: order.id,
            transactionId,
            user: userId,
            match,
            status,
            amount,
            baseAmount,
            quantity,
            section,
            currency,
            notes,
            name,
            phone,
            email
        });

        await newOrder.save();



        // const ticket = new Ticket({
        //     user: userId,
        //     event: eventId,
        //     ticketDetails,
        //     orderId: newOrder._id,
        // });

        // await ticket.save();

        // Update user's bookings
        // await User.findByIdAndUpdate(userId, {
        //     $push: { bookings: { eventId, ticketDetails, bookingDate: new Date(), orderId: newOrder._id } },
        // });

        return new Response(JSON.stringify({ success: true, order: order, orderDetails: newOrder }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
