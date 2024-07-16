import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";


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
        console.log(response.data)
        // console.log("r===", response.data.code);

        if (response.data.code == "PAYMENT_SUCCESS") {
            
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/success/`, {
                status: 301,
            });
        }
        else if (response.data.code == "PAYMENT_PENDING") {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/durand-cup/payment-pending/`, {
                status: 301,
            });
        }
        else {
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