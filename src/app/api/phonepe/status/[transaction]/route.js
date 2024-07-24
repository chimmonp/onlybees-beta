import connectMongo from '@/lib/mongodb';
import DurandOrder from '@/models/DurandOrder';
import DurandTicket from '@/models/DurandTicket';
import Section from '@/models/Section';
import Match from '@/models/Match';
import User from '@/models/User';
import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import QRCode from 'qrcode';
import { sendDurandEmail } from '@/lib/nodemailer'; // Adjust the import path
import durandEmailTemplate from '@/templates/durandEmailTemplate.hbs'; // Import the precompiled template
import durandPdfTemplate from '@/templates/durandPdfTemplate.hbs'; // Import the precompiled template
import { generatePdfFromHtml } from '@/lib/generateTicketPDF';


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

export async function POST(req, res) {
    try {
        const data = await req.formData();

        // console.log(data)

        if (!data) {
            return new Response(JSON.stringify({ success: false, error: 'Data not available' }), { status: 400 });
        }
        // console.log(data)

        const status = data.get("code");
        const merchantId = data.get("merchantId");
        const transactionId = data.get("transactionId");

        // console.log(status, merchantId, transactionId)


        const st = `/pg/v1/status/${merchantId}/${transactionId}` + process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY;
        // console.log(st)
        const dataSha256 = sha256(st);

        const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX;
        // console.log(checksum);

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
        // console.log(response.data)
        // console.log("r===", response.data.code);

        await connectMongo();

        const order = await DurandOrder.findOne({ transactionId });

        // console.log(order)

        if (!order) {
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
        }

        // console.log(order)

        if (response.data.code == "PAYMENT_SUCCESS") {

            // order.status = "SUCCESS";
            // await order.save();

            const section = await Section.findById(order.section);
            // console.log(section)
            if (!section) {
                return new Response(JSON.stringify({ success: false, error: 'Section Not Found' }), { status: 404 });
            }

            const match = await Match.findById(order.match);
            // console.log(match)
            if (!match) {
                return new Response(JSON.stringify({ success: false, error: 'Match Not Found' }), { status: 404 });
            }

            const dateEntry = section.availableQuantity.find(entry => entry.date === match.slug);
            // console.log(dateEntry)
            if (!dateEntry) {
                return new Response(JSON.stringify({ success: false, error: 'Date Not Available' }), { status: 400 });
            }
            // Update the quantity
            dateEntry.quantity -= order.quantity; // Reduce quantity by tickets purchased
            // Save the updated section
            await section.save();

            const user = await User.findOne({ phone: order.phone });
            if (!user) {
                return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
            }

            await DurandOrder.findByIdAndUpdate(order._id, { status: "SUCCESS", user: user._id })

            const newTicket = new DurandTicket({
                user: user._id,
                match: order.match,
                section: order.section,
                gate: section.gate,
                entry: section.entry,
                quantity: order.quantity,
                amount: order.amount,
                bookingDate: order.createdAt,
                orderId: order._id,
                isUsed: false,
            });
            const qrCodeUrl = await generateQrCodeUrl(newTicket._id.toString());

            await newTicket.save();

            await DurandTicket.findByIdAndUpdate(newTicket._id, { qrLink: qrCodeUrl });

            const sportsBooking = {
                match: order.match,
                ticket: newTicket._id,
                bookingDate: order.createdAt,
                orderId: order._id,
                qrLink: qrCodeUrl,
            };

            // Update the user document
            await User.findByIdAndUpdate(user._id, {
                $push: { sportsBookings: sportsBooking },
            });

            // Update user's bookings and update event details
            const updatedMatch = await Match.findByIdAndUpdate(
                order.match,
                {
                    $inc: {
                        sold: order.quantity,
                        totalSales: order.baseAmount,
                    },
                },
                { new: true }
            );

            // Check if event update was successful
            if (!updatedMatch) {
                return new Response(JSON.stringify({ success: false, error: 'Failed to update event details' }), { status: 500 });
            }



            // Render the ticket template
            const emailHtml = durandEmailTemplate({
                name: order.name,
                email: order.email,
                phone: order.phone,
                amount: order.amount.toFixed(2),
                baseAmt: order.baseAmount.toFixed(2),
                convenienceFee: (order.baseAmount * 0.03).toFixed(2),
                platformFee: (order.baseAmount * 0.0236).toFixed(2),
                totalAmount: order.amount,
                teamA: updatedMatch.teamA,
                teamB: updatedMatch.teamB,
                matchDate: updatedMatch.date,
                entry: section.entry,
                gate: section.gate,
                bowl: section.bowl,
                time: updatedMatch.time,
                bookingDate: formatDate(order.createdAt),
                quantity: order.quantity,
                transactionId: order.transactionId,
                bookingId: order._id.toString(),
            });

            // Render the ticket template
            const pdfHtml = await durandPdfTemplate({
                name: order.name,
                email: order.email,
                phone: order.phone,
                amount: order.amount.toFixed(2),
                baseAmt: order.baseAmount.toFixed(2),
                convenienceFee: (order.baseAmount * 0.03).toFixed(2),
                platformFee: (order.baseAmount * 0.0236).toFixed(2),
                totalAmount: order.amount,
                teamA: updatedMatch.teamA,
                teamB: updatedMatch.teamB,
                matchDate: updatedMatch.date.split(' ')[0],
                entry: section.entry,
                gate: section.gate,
                bowl: section.bowl,
                time: updatedMatch.time,
                bookingDate: formatDate(order.createdAt),
                quantity: order.quantity,
                transactionId: order.transactionId,
                bookingId: order._id.toString(),
                image: qrCodeUrl, // reference to the CID of the attached image
            });

            // Generate PDF from HTML
            const pdfBuffer = await generatePdfFromHtml(pdfHtml);

            // Send the email with PDF and QR code attachments
            await sendDurandEmail(order.email, `Booking Confirmation & Tickets - Durand Cup`, emailHtml, pdfBuffer, newTicket._id);
















            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/success/`, {
                status: 301,
            });
        }
        else if (response.data.code == "PAYMENT_PENDING") {
            // order.status = "PAYMENT PENDING";
            // await order.save();

            // await Section.updateOne(
            //     { _id: order.section, 'availableQuantity.date': order.date },
            //     { $inc: { 'availableQuantity.$.quantity': order.quantity } }
            // );
            const section = await Section.findById(order.section);
            if (!section) {
                return new Response(JSON.stringify({ success: false, error: 'Section Not Found' }), { status: 404 });
            }

            const match = await Match.findById(order.match);
            if (!match) {
                return new Response(JSON.stringify({ success: false, error: 'Match Not Found' }), { status: 404 });
            }

            const dateEntry = section.availableQuantity.find(entry => entry.date === match.slug);
            if (!dateEntry) {
                return new Response(JSON.stringify({ success: false, error: 'Date Not Available' }), { status: 400 });
            }
            // Update the quantity
            dateEntry.quantity += order.quantity; // Reduce quantity by tickets purchased
            // Save the updated section
            await section.save();


            await DurandOrder.findByIdAndUpdate(order._id, { status: "PAYMENT_PENDING", })
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/payment-pending/`, {
                status: 301,
            });
        }
        else {
            // order.status = "PAYMENT FAILED";
            // await order.save();
            const section = await Section.findById(order.section);
            if (!section) {
                return new Response(JSON.stringify({ success: false, error: 'Section Not Found' }), { status: 404 });
            }

            const match = await Match.findById(order.match);
            if (!match) {
                return new Response(JSON.stringify({ success: false, error: 'Match Not Found' }), { status: 404 });
            }

            const dateEntry = section.availableQuantity.find(entry => entry.date === match.slug);
            if (!dateEntry) {
                return new Response(JSON.stringify({ success: false, error: 'Date Not Available' }), { status: 400 });
            }
            // Update the quantity
            dateEntry.quantity += order.quantity; // Reduce quantity by tickets purchased
            // Save the updated section
            await section.save();

            // await Section.updateOne(
            //     { _id: order.section, 'availableQuantity.date': order.date },
            //     { $inc: { 'availableQuantity.$.quantity': order.quantity } }
            // );

            await DurandOrder.findByIdAndUpdate(order._id, { status: "PAYMENT_FAILED", })
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/failed`, {
                // a 301 status is required to redirect from a POST to a GET route
                status: 301,
            });
        }

        // return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}