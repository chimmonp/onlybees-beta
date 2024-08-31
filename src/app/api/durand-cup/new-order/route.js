import connectMongo from '@/lib/mongodb';
import DurandOrder from '@/models/DurandOrder';
import DurandTicket from '@/models/DurandTicket';
import Section from '@/models/Section';
import SeatLock from '@/models/SeatLock';
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
        const { searchParams } = new URL(req.url);
        const transactionId = searchParams.get('transactionId');

        await connectMongo();

        const order = await DurandOrder.findOne({ transactionId });

        if (!order) {
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
        }

        if (order.status !== "SUCCESS") {
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
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/success/`, { status: 301 });
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

            dateEntry.quantity -= order.quantity; // Reduce quantity by tickets purchased
            dateEntry.lockedSeats -= order.quantity; // Decrement locked seats by the quantity
            await section.save();

            await SeatLock.deleteOne({ sectionId: section._id, date: match.slug, transactionId: order.transactionId });

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
                // Template variables...
            });

            const pdfHtml = await durandPdfTemplate({
                // Template variables...
            });

            const pdfBuffer = await generatePdfFromHtml(pdfHtml);
            await sendDurandEmail(order.email, `Booking Confirmation & Tickets - Durand Cup`, emailHtml, pdfBuffer, newTicket._id);

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/success/`, { status: 301 });
        }

        // Default response if no conditions are met
        return new Response(JSON.stringify({ success: false, error: 'No matching condition met' }), { status: 400 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
