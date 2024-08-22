import connectMongo from '@/lib/mongodb';
import DurandOrder from '@/models/DurandOrder';
import DurandTicket from '@/models/DurandTicket';
import Section from '@/models/Section';
import Match from '@/models/Match';
import User from '@/models/User';
import { NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from 'qrcode';
import { sendDurandEmail } from '@/lib/nodemailer';
import durandEmailTemplate from '@/templates/durandEmailTemplate.hbs';
import durandPdfTemplate from '@/templates/durandPdfTemplate.hbs';
import { generatePdfFromHtml } from '@/lib/generateTicketPDF';

const verifyChecksum = (data, receivedChecksum) => {
    const workingKey = process.env.CCAVENUE_WORKING_KEY;
    const text = Object.keys(data).sort().map(key => data[key]).join('');
    const checksum = crypto.createHash('sha512').update(text + workingKey).digest('hex');
    return checksum === receivedChecksum;
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

export async function POST(req, res) {
    try {
        const data = await req.formData();

        if (!data) {
            return new Response(JSON.stringify({ success: false, error: 'Data not available' }), { status: 400 });
        }

        const status = data.get("order_status");
        const merchantId = data.get("merchant_id");
        const transactionId = data.get("tracking_id");
        const receivedChecksum = data.get("checksum");

        // Verify the checksum
        if (!verifyChecksum(data, receivedChecksum)) {
            return new Response(JSON.stringify({ success: false, error: 'Checksum validation failed' }), { status: 400 });
        }

        await connectMongo();

        const order = await DurandOrder.findOne({ transactionId });

        if (!order) {
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
        }

        if (status === "Success" && order.status !== "SUCCESS") {

            const section = await Section.findById(order.section);
            if (!section) {
                return new Response(JSON.stringify({ success: false, error: 'Section Not Found' }), { status: 404 });
            }

            const match = await Match.findById(order.match);
            if (!match) {
                return new Response(JSON.stringify({ success: false, error: 'Match Not Found' }), { status: 404 });
            }

            const user = await User.findOne({ phone: order.phone });
            if (!user) {
                return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
            }

            await DurandOrder.findByIdAndUpdate(order._id, { status: "SUCCESS", user: user._id });

            const existingTicket = await DurandTicket.findOne({ orderId: order._id, user: user._id });
            if (existingTicket) {
                return NextResponse.redirect(`https://onlybees.in/durand-cup/success/`, {
                    status: 301,
                });
            }

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

            const dateEntry = section.availableQuantity.find(entry => entry.date === match.slug);
            if (!dateEntry) {
                return new Response(JSON.stringify({ success: false, error: 'Date Not Available' }), { status: 400 });
            }

            dateEntry.quantity -= order.quantity;
            await section.save();

            const sportsBooking = {
                match: order.match,
                ticket: newTicket._id,
                bookingDate: order.createdAt,
                orderId: order._id,
                qrLink: qrCodeUrl,
            };

            await User.findByIdAndUpdate(user._id, {
                $push: { sportsBookings: sportsBooking },
            });

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

            if (!updatedMatch) {
                return new Response(JSON.stringify({ success: false, error: 'Failed to update event details' }), { status: 500 });
            }

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
                image: qrCodeUrl,
            });

            const pdfBuffer = await generatePdfFromHtml(pdfHtml);

            await sendDurandEmail(order.email, `Booking Confirmation & Tickets - Durand Cup`, emailHtml, pdfBuffer, newTicket._id);

            return NextResponse.redirect(`https://onlybees.in/durand-cup/success/`, {
                status: 301,
            });

        } else if (status === "Pending") {
            await DurandOrder.findByIdAndUpdate(order._id, { status: "PAYMENT_PENDING" });
            return NextResponse.redirect(`https://onlybees.in/durand-cup/payment-pending/`, {
                status: 301,
            });
        } else {
            await DurandOrder.findByIdAndUpdate(order._id, { status: "PAYMENT_FAILED" });
            return NextResponse.redirect(`https://onlybees.in/durand-cup/failed`, {
                status: 301,
            });
        }

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
