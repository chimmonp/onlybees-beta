import QRCode from 'qrcode';
import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import Event from '@/models/Event'
import { sendEmail } from '@/lib/nodemailer'; // Adjust the import path
import emailTemplate from '@/templates/emailTemplate.hbs'; // Import the precompiled template
import pdfTemplate from '@/templates/pdfTemplate.hbs'; // Import the precompiled template
import { generatePdfFromHtml } from '@/lib/generateTicketPDF';
import axios from 'axios'
import crypto from 'crypto'


const hashData = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

const generateQrCodeUrl = async (text) => {
    try {
        const qrCodeUrl = await QRCode.toDataURL(text);
        return qrCodeUrl;
    } catch (err) {
        console.error('Error generating QR code', err);
        throw err;
    }
};

const formatDate = (date) => {
    // Parse the date string into a Date object
    const newDate = new Date(date);
    // Define the offset for the target timezone (+05:30)
    const targetOffset = 5.5 * 60; // 5.5 hours in minutes
    // Get the current offset of the local system timezone
    const localOffset = newDate.getTimezoneOffset(); // in minutes
    // Calculate the total offset to apply
    const totalOffset = targetOffset + localOffset;
    // Apply the offset to the date
    date.setMinutes(newDate.getMinutes() + totalOffset);
    // Format the date to the desired string representation
    const pad = (num) => String(num).padStart(2, '0');
    const formattedDate = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}, ${pad(newDate.getHours())}:${pad(newDate.getMinutes())}:${pad(newDate.getSeconds())}.${String(newDate.getMilliseconds()).padStart(3, '0')}+05:30`;
    return formattedDate; // "2024-06-16, 17:49:46.255+05:30"
}


export const POST = async (req, res) => {
    try {
        await connectMongo();

        const { ticket, orderDetails, convenienceFee, platformFee, phone, email, firstname, lastname } = await req.json();
        // console.log(ticket, orderDetails, convenienceFee, platformFee, phone, email, firstname, lastname)
        const name = firstname + " " + lastname;

        const totalQuantity = ticket.ticketDetails.reduce((accumulator, current) => {
            return accumulator + current.quantity;
        }, 0);

        const selectedTickets = ticket.ticketDetails.map(ticketItem => `${ticketItem.ticketType} (x${ticketItem.quantity})`);

        const user = await User.findOne({ phone: phone });
        if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
        }

        const event = await Event.findOne({ _id: ticket.event });
        if (!event) {
            return new Response(JSON.stringify({ success: false, error: 'Event not found' }), { status: 404 });
        }
        const dateObj = new Date(event.date);
        const date = dateObj.getDate(); // 10
        const month = dateObj.toLocaleString('default', { month: 'long' }); // June

        // Include user ID in ticket and order details
        const userId = user._id;
        const newTicket = new Ticket({ ...ticket, user: userId, isUsed: false });
        const newOrder = new Order({ ...orderDetails, user: userId, name: name, phone: phone, email: email });

        //Calculate amount
        const amount = orderDetails.amount - (convenienceFee + platformFee);

        //GST Calculation
        const baseAmt = amount/1.18;
        const gst = amount - baseAmt;

        // Generate QR code for the pdf ticket
        const qrCodeUrl = await generateQrCodeUrl(newTicket._id.toString());

        // Render the ticket template
        const emailHtml = emailTemplate({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: user.phone,
            amount: amount.toFixed(2),
            baseAmt: baseAmt.toFixed(2),
            gst: gst.toFixed(2),
            convenienceFee: convenienceFee,
            platformFee: platformFee,
            totalAmount: orderDetails.amount,
            eventTitle: event.title,
            venue: event.venue,
            eventDateTime: formatDate(event.date),
            time: event.time,
            bookingDate: formatDate(newOrder.createdAt),
            tickets: selectedTickets,
            transactionId: orderDetails.paymentId,
            bookingId: newOrder._id.toString(),
        });

        // Render the ticket template
        const pdfHtml = await pdfTemplate({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: user.phone,
            amount: amount,
            baseAmt: baseAmt.toFixed(2),
            gst: gst.toFixed(2),
            convenienceFee: convenienceFee,
            platformFee: platformFee,
            totalAmount: orderDetails.amount,
            totalQuantity: totalQuantity,
            eventTitle: event.title,
            venue: event.venue,
            formattedDate: date,
            formattedMonth: month,
            formattedTime: event.time,
            tickets: selectedTickets,
            bookingId: ticket._id,
            transactionId: orderDetails.paymentId,
            image: qrCodeUrl, // reference to the CID of the attached image
        });

        const ticketId = ticket._id;

        // await Ticket.findByIdAndUpdate( ticketId, { qrLink: qrCodeUrl, })

        await newOrder.save();
        await newTicket.save();

        // Update user's bookings
        await User.findByIdAndUpdate(userId, {
            $push: {
                bookings: {
                    eventId: ticket.event,
                    ticketDetails: ticket.ticketDetails,
                    bookingDate: new Date(),
                    orderId: newOrder._id,
                    ticketId: ticketId,
                    qrLink: qrCodeUrl,
                },
            },
        });

        await Ticket.findByIdAndUpdate(ticketId, { qrLink: qrCodeUrl });

        // Update user's bookings and update event details
        const updatedEvent = await Event.findByIdAndUpdate(
            ticket.event,
            {
                $inc: {
                    totalSales: amount,
                    ticketsSold: totalQuantity,
                },
            },
            { new: true }
        );

        // Check if event update was successful
        if (!updatedEvent) {
            return new Response(JSON.stringify({ success: false, error: 'Failed to update event details' }), { status: 500 });
        }


        // Generate PDF from HTML
        const pdfBuffer = await generatePdfFromHtml(pdfHtml);

        // Send the email with PDF and QR code attachments
        await sendEmail(email, `Booking Confirmation & Tickets - ${event.title}`, emailHtml, pdfBuffer, ticketId);




        // Meta Conversion API Call
        // try {
        //     const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN; // Replace with your generated access token
        //     const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID; // Replace with your Pixel ID
        //     await axios.post(
        //         `https://graph.facebook.com/v12.0/${pixelId}/events?access_token=${accessToken}`,
        //         {
        //             data: [
        //                 {
        //                     event_name: 'Purchase',
        //                     event_time: Math.floor(Date.now() / 1000),
        //                     user_data: {
        //                         em: hashData(email), // hashed email
        //                         ph: hashData(phone), // hashed phone number
        //                     },
        //                     custom_data: {
        //                         currency: 'INR',
        //                         value: amount,
        //                         content_name: event.title,
        //                         content_category: 'Event',
        //                         content_ids: [ticket._id.toString()],
        //                         num_items: totalQuantity,
        //                         order_id: newOrder._id.toString(),
        //                     },
        //                     action_source: 'website',
        //                 },
        //             ],
        //         }
        //     );
        // } catch (error) {
        //     console.error('Meta Conversion API Error:', error);
        // }




        return new Response(JSON.stringify({ success: true }), { status: 201 });


    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
