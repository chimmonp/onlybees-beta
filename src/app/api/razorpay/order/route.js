import connectMongo from '@/lib/mongodb';
import razorpay from '@/lib/razorpay';
import Order from '@/models/Order';
import Ticket from '@/models/Ticket';
import User from '@/models/User';

export const POST = async (req, res) => {
    try {
        await connectMongo();

        const { userId, eventId, ticketDetails, amount, currency, receipt, notes } = await req.json();

        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);

        const newOrder = new Order({
            user: userId,
            event: eventId,
            amount,
            currency,
            receipt,
            orderId: order.id,
            notes,
        });

        // await newOrder.save();



        const ticket = new Ticket({
            user: userId,
            event: eventId,
            ticketDetails,
            orderId: newOrder._id,
        });

        // await ticket.save();

        // Update user's bookings
        // await User.findByIdAndUpdate(userId, {
        //     $push: { bookings: { eventId, ticketDetails, bookingDate: new Date(), orderId: newOrder._id } },
        // });

        return new Response(JSON.stringify({ success: true, order: order, ticket: ticket, orderDetails: newOrder }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
