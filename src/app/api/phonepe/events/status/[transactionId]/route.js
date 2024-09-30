import connectMongo from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Ticket from '@/models/Ticket';
// import RestaurantSection from '@/models/RestaurantSection';
import Event from '@/models/Event';
import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { sendEmail } from '@/lib/nodemailer'; // Update email sending function for reservations
import emailTemplate from '@/templates/emailTemplate.hbs'; // Import the reservation email template
import pdfTemplate from '@/templates/pdfTemplate.hbs'; // Import the reservation email template
import { generatePdfFromHtml } from '@/lib/generateTicketPDF'; // If you need to generate PDFs for reservations
import QRCode from 'qrcode';

const formatDate = (date) => {
    const newDate = new Date(date);
    const targetOffset = 5.5 * 60; // 5.5 hours in minutes
    const localOffset = newDate.getTimezoneOffset();
    const totalOffset = targetOffset + localOffset;
    date.setMinutes(newDate.getMinutes() + totalOffset);
    const pad = (num) => String(num).padStart(2, '0');
    const formattedDate = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}, ${pad(newDate.getHours())}:${pad(newDate.getMinutes())}:${pad(newDate.getSeconds())}.${String(newDate.getMilliseconds()).padStart(3, '0')}+05:30`;
    return formattedDate;
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


export async function POST(req, res) {
    try {
        const data = await req.formData();

        if (!data) {
            return new Response(JSON.stringify({ success: false, error: 'Data not available' }), { status: 400 });
        }

        const status = data.get("code");
        const merchantId = data.get("merchantId");
        const transactionId = data.get("transactionId");

        // console.log('\n\n\n', merchantId, orderId, '\n\n\n')

        const st = `/pg/v1/status/${merchantId}/${transactionId}` + process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY;
        const dataSha256 = sha256(st);
        const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX;

        const options = {
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_PHONEPE_HOST_URL}/pg/v1/status/${merchantId}/${transactionId}`,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
                "X-MERCHANT-ID": `${merchantId}`,
            },
        };

        const response = await axios.request(options);

        await connectMongo();

        const order = await Order.findOne({ orderId: transactionId });

        if (!order) {
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
        }

        // console.log("Found Order: ", order)

        if (response.data.code === "PAYMENT_SUCCESS" && order.status !== "SUCCESS") {

            // Update reservation status
            await Order.findByIdAndUpdate(order._id, { status: "SUCCESS" });

            // Find the table and restaurant section
            const event = await Event.findById(order.event);
            // const restaurantSection = await RestaurantSection.findById(table.section_id);

            // console.log(table, restaurantSection)

            if (!event) {
                return new Response(JSON.stringify({ success: false, error: 'Event Not Found' }), { status: 404 });
            }
            const dateObj = new Date(event.date);
            const date = dateObj.getDate(); // 10
            const month = dateObj.toLocaleString('default', { month: 'long' }); // June

            // if (!table) {
            //     return new Response(JSON.stringify({ success: false, error: 'Restaurant Table Not Found' }), { status: 404 });
            // }

            // const restaurant = await Restaurant.findById(restaurantSection.restaurant_id);
            // if (!restaurant) {
            //     return new Response(JSON.stringify({ success: false, error: 'Restaurant not found' }), { status: 404 });
            // }

            const user = await User.findOne({ phone: order.phone });

            if (!user) {
                return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
            }

            // console.log("\n\nUser and Event found----", event, user, "\n\n")

            const totalQuantity = order.ticketDetails.reduce((accumulator, current) => {
                return accumulator + current.quantity;
            }, 0);

            const selectedTickets = order.ticketDetails.map(ticketItem => `${ticketItem.ticketType} (x${ticketItem.quantity})`);


            // console.log("\n\nTicketDetails----", totalQuantity, selectedTickets, "\n\n")

            const baseAmt = ( order.amount - order.convenienceFee - order.convenienceFee ) / 1.18;
            const gst = ( order.amount - order.convenienceFee - order.convenienceFee ) - baseAmt;


            const newTicket = new Ticket({ ticketDetails: order.ticketDetails, user: user._id, isUsed: false, orderId: order._id, event: order.event });
            await newTicket.save();

            // Generate QR code for the pdf ticket
            const qrCodeUrl = await generateQrCodeUrl(newTicket._id.toString());

            // // Prepare email content
            // const emailHtml = reservationEmailTemplate({
            //     transactionId: reservation.transactionId,
            //     reservationId: reservation._id,
            //     name: reservation.name,
            //     email: reservation.email,
            //     phone: reservation.phone,
            //     amount: reservation.amount,
            //     tableName: table.name,
            //     restaurantName: restaurant.name,
            //     restaurantSectionName: restaurantSection.name,
            //     reservationDate: formatDate(reservation.date),
            //     reservationStartTime: reservation.start_time,
            //     reservationEndTime: reservation.end_time,
            //     transactionId: reservation.transactionId,
            //     bookingId: reservation._id.toString(),
            // });

            // Render the ticket template
            const emailHtml = emailTemplate({
                name: order.name,
                email: order.email,
                phone: order.phone,
                // amount: order.amount.toFixed(2),
                baseAmt: baseAmt.toFixed(2),
                gst: gst.toFixed(2),
                convenienceFee: order.convenienceFee.toFixed(2),
                platformFee: order.platformFee.toFixed(2),
                totalAmount: order.amount.toFixed(2),
                eventTitle: event.title,
                venue: event.venue,
                eventDateTime: formatDate(event.date),
                time: event.time,
                bookingDate: formatDate(order.createdAt),
                tickets: selectedTickets,
                transactionId: order.orderId,
                bookingId: order._id.toString(),
            });

            // Optionally generate a PDF from HTML
            // const pdfHtml = reservationPdfTemplate({
            //     name: user.firstname,
            //     email: user.email,
            //     phone: user.phone,
            //     tableName: table.name,
            //     restaurantSectionName: restaurantSection.name,
            //     reservationDate: formatDate(reservation.date),
            //     reservationTime: reservation.time,
            //     transactionId: reservation.transactionId,
            //     bookingId: reservation._id.toString(),
            // });

            // Render the ticket template
            const pdfHtml = await pdfTemplate({
                name: order.name,
                email: order.email,
                phone: order.phone,
                amount: order.amount,
                baseAmt: baseAmt.toFixed(2),
                gst: gst.toFixed(2),
                convenienceFee: order.convenienceFee.toFixed(2),
                platformFee: order.platformFee.toFixed(2),
                totalAmount: order.amount,
                totalQuantity: totalQuantity,
                eventTitle: event.title,
                venue: event.venue,
                formattedDate: date,
                formattedMonth: month,
                formattedTime: event.time,
                tickets: selectedTickets,
                bookingId: order._id,
                transactionId: order.orderId,
                image: qrCodeUrl, // reference to the CID of the attached image
            });

            // Update user's bookings
            await User.findByIdAndUpdate(user._id, {
                $push: {
                    bookings: {
                        eventId: event._id,
                        ticketDetails: order.ticketDetails,
                        bookingDate: new Date(),
                        orderId: order._id,
                        ticketId: newTicket._id,
                        qrLink: qrCodeUrl,
                    },
                },
            });

            const updatedEvent = await Event.findByIdAndUpdate(
                order.event,
                {
                    $inc: {
                        totalSales: ( order.amount - order.convenienceFee - order.convenienceFee ),
                        ticketsSold: totalQuantity,
                    },
                },
                { new: true }
            );

            // Check if event update was successful
            if (!updatedEvent) {
                return new Response(JSON.stringify({ success: false, error: 'Failed to update event details' }), { status: 500 });
            }

            await Ticket.findByIdAndUpdate(newTicket._id, { qrLink: qrCodeUrl });

            // Generate PDF from HTML
            const pdfBuffer = await generatePdfFromHtml(pdfHtml);

            // Send the email with PDF and QR code attachments
            await sendEmail(order.email, `Booking Confirmation & Tickets - ${event.title}`, emailHtml, pdfBuffer, newTicket._id);

            // Send the email with PDF attachment
            // await sendEmail(user.email, `Booking Confirmation - ${restaurant.name}`, emailHtml);

            return NextResponse.redirect(`https://onlybees.in/event/success?booking=${order.orderId}`, {
                status: 301,
            });
        } else if (response.data.code === "PAYMENT_PENDING") {
            // Update reservation status to payment pending
            // await Reservation.findByIdAndUpdate(reservation._id, { status: "PAYMENT_PENDING" });
            await Order.findByIdAndUpdate(order._id, { status: "PAYMENT_PENDING" });
            return NextResponse.redirect(`https://onlybees.in/event/payment-pending/`, {
                status: 301,
            });
        } else if (response.data.code === "PAYMENT_SUCCESS" && order.status === "SUCCESS") {
            // Redirect if payment already successful
            return NextResponse.redirect(`https://onlybees.in/event/success/`, {
                status: 301,
            });
        } else {
            // Handle payment failure
            // await Reservation.findByIdAndUpdate(reservation._id, { status: "PAYMENT_FAILED" });
            await Order.findByIdAndUpdate(order._id, { status: "PAYMENT_FAILED" });
            return NextResponse.redirect(`https://onlybees.in/event/failed`, {
                status: 301,
            });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
