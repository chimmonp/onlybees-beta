

import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order';
import Ticket from '@/models/Ticket';

import axios from 'axios';
import sha256 from 'crypto-js/sha256';

export async function POST(req, res) {
    try {
        await connectMongo();

        const phonePeSaltKey = process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY;  // Replace with your actual salt key
        const phonePeSaltIndex = process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX;  // Replace with your actual salt index

        // const { transactionId, paymentState, paymentDetails } = await req.json();
        const base64Response = req.body.response;
        const decodedResponse = Buffer.from(base64Response, 'base64').toString('utf-8');
        const jsonResponse = JSON.parse(decodedResponse);

        // console.log(req.json)
        // Verify the X-VERIFY header
        const xVerify = req.headers['x-verify'];
        const [checksum, saltIndex] = xVerify.split('###');
        const data = base64Response + phonePeSaltKey;
        const calculatedChecksum = crypto.createHash('sha256').update(data).digest('hex');


        if (calculatedChecksum !== checksum || saltIndex !== phonePeSaltIndex) {
            // return res.status(400).json({ success: false, message: 'Verification failed' });
            return new Response(JSON.stringify({ success: false, error: 'Verification failed' }), { status: 400 });
        }

        // Verify the payment state
        // if (paymentState !== 'SUCCESS') {
        //     // return res.status(400).json({ success: false, message: 'Payment failed' });
        //     return new Response(JSON.stringify({ success: false, error: 'Payment failed' }), { status: 400 });
        // }

         // Handle the payment status
         const paymentStatus = jsonResponse.data.state;
         if (paymentStatus === 'COMPLETED') {
             // Payment succeeded
             // Update your database with the payment details
             console.log('Payment succeeded:', jsonResponse);
         } else {
             // Payment failed
             console.log('Payment failed:', jsonResponse);
         }

        // Save order details to the database
        // const newOrder = new Order({
        //     user: paymentDetails.userId,
        //     event: paymentDetails.eventId,
        //     amount: paymentDetails.amount,
        //     currency: paymentDetails.currency,
        //     receipt: paymentDetails.receipt,
        //     orderId: transactionId,
        //     notes: paymentDetails.notes,
        //     paymentStatus: 'Completed',
        // });

        // await newOrder.save();

        // const ticket = new Ticket({
        //     user: paymentDetails.userId,
        //     event: paymentDetails.eventId,
        //     ticketDetails: paymentDetails.ticketDetails,
        //     orderId: newOrder._id,
        // });

        // await ticket.save();

        // return res.status(200).json({ success: true, message: 'Payment successful, order saved' });
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
