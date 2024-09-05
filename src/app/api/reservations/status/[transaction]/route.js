import connectMongo from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import User from '@/models/User';
import Table from '@/models/Table';
import RestaurantSection from '@/models/RestaurantSection';
import Restaurant from '@/models/Restaurant';
import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { sendReservationEmail } from '@/lib/nodemailer'; // Update email sending function for reservations
import reservationEmailTemplate from '@/templates/reservationEmailTemplate.hbs'; // Import the reservation email template
import reservationPdfTemplate from '@/templates/reservationPdfTemplate.hbs'; // Import the reservation email template
import { generatePdfFromHtml } from '@/lib/generateTicketPDF'; // If you need to generate PDFs for reservations

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

export async function POST(req, res) {
    try {
        const data = await req.formData();

        if (!data) {
            return new Response(JSON.stringify({ success: false, error: 'Data not available' }), { status: 400 });
        }

        const status = data.get("code");
        const merchantId = data.get("merchantId");
        const transactionId = data.get("transactionId");

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

        const reservation = await Reservation.findOne({ transactionId });

        if (!reservation) {
            return new Response(JSON.stringify({ success: false, error: 'Reservation not found' }), { status: 404 });
        }

        if (response.data.code === "PAYMENT_SUCCESS" && reservation.status !== "SUCCESS") {
            
            // Update reservation status
            await Reservation.findByIdAndUpdate(reservation._id, { status: "SUCCESS" });

            // Find the table and restaurant section
            const table = await Table.findById(reservation.table_id);
            const restaurantSection = await RestaurantSection.findById(table.section_id);

            console.log(table, restaurantSection)

            if (!restaurantSection) {
                return new Response(JSON.stringify({ success: false, error: 'Restaurant Section Not Found' }), { status: 404 });
            }

            if (!table) {
                return new Response(JSON.stringify({ success: false, error: 'Restaurant Table Not Found' }), { status: 404 });
            }

            const restaurant = await Restaurant.findById(restaurantSection.restaurant_id);
            if (!restaurant) {
                return new Response(JSON.stringify({ success: false, error: 'Restaurant not found' }), { status: 404 });
            }

            const user = await User.findOne({ phone: reservation.phone });

            if (!user) {
                return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
            }

            // Prepare email content
            const emailHtml = reservationEmailTemplate({
                transactionId: reservation.transactionId,
                reservationId: reservation._id,
                name: reservation.name,
                email: reservation.email,
                phone: reservation.phone,
                amount: reservation.amount,
                tableName: table.name,
                restaurantName: restaurant.name,
                restaurantSectionName: restaurantSection.name,
                reservationDate: formatDate(reservation.date),
                reservationStartTime: reservation.start_time,
                reservationEndTime: reservation.end_time,
                transactionId: reservation.transactionId,
                bookingId: reservation._id.toString(),
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

            // Generate PDF from HTML if needed
            // const pdfBuffer = await generatePdfFromHtml(pdfHtml);

            // Send the email with PDF attachment
            await sendReservationEmail(user.email, `Reservation Confirmation - ${restaurant.name}`, emailHtml);

            return NextResponse.redirect(`https://onlybees.in/tyc/success/`, {
                status: 301,
            });
        } else if (response.data.code === "PAYMENT_PENDING") {
            // Update reservation status to payment pending
            await Reservation.findByIdAndUpdate(reservation._id, { status: "PAYMENT_PENDING" });
            return NextResponse.redirect(`https://onlybees.in/tyc/payment-pending/`, {
                status: 301,
            });
        } else if (response.data.code === "PAYMENT_SUCCESS" && reservation.status === "SUCCESS") {
            // Redirect if payment already successful
            return NextResponse.redirect(`https://onlybees.in/tyc/success/`, {
                status: 301,
            });
        } else {
            // Handle payment failure
            await Reservation.findByIdAndUpdate(reservation._id, { status: "PAYMENT_FAILED" });
            return NextResponse.redirect(`https://onlybees.in/tyc/failed`, {
                status: 301,
            });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
