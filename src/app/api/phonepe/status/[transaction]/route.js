import connectMongo from '@/lib/mongodb';
import DurandOrder from '@/models/DurandOrder';
import DurandTicket from '@/models/DurandTicket';
import Section from '@/models/Section';
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

export async function POST(req, res) {
    try {
        const data = await req.formData();

        if (!data) {
            return new Response(JSON.stringify({ success: false, error: 'Data not available' }), { status: 400 });
        }
        // console.log(data)

        const status = data.get("code");
        const merchantId = data.get("merchantId");
        const transactionId = data.get("transactionId");


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

        if (!order) {
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), { status: 404 });
        }

        if (response.data.code == "PAYMENT_SUCCESS") {

            order.status = "SUCCESS";
            await order.save();

            const user = await User.findOne({ phone: order.phone });
            if (!user) {
                return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
            }

            const section = await Section.findById(order.section);
            if (!section) {
                return new Response(JSON.stringify({ success: false, error: 'Section not found' }), { status: 404 });
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

            // Update user's bookings and update event details
            const updatedMatch = await Match.findByIdAndUpdate(
                order.match,
                {
                    $inc: {
                        sold: order.quantity,
                        totalSales: order.amount - (0.0536 * order.amount),
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
                totalAmount: orderDetails.amount,
                teamA: updatedMatch.teamA,
                teamB: updatedMatch.teamB,
                matchDate: updatedMatch.date,
                entry: section.entry,
                gate: section.gate,
                bowl: section.bowl,
                time: updatedMatch.time,
                bookingDate: order.createdAt,
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
                totalAmount: orderDetails.amount,
                teamA: updatedMatch.teamA,
                teamB: updatedMatch.teamB,
                matchDate: updatedMatch.date,
                entry: section.entry,
                gate: section.gate,
                bowl: section.bowl,
                time: updatedMatch.time,
                bookingDate: order.createdAt,
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
            order.status = "PAYMENT PENDING";
            await order.save();
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/payment-pending/`, {
                status: 301,
            });
        }
        else {
            order.status = "PAYMENT FAILED";
            await order.save();
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