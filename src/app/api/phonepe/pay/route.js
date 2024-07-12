// pages/api/proxy.js
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import cors from 'cors'

export const POST = async (req, res) => {
    if (req.method === 'POST') {
        const { merchantId, merchantTransactionId, merchantUserId, amount, redirectUrl, redirectMode, callbackUrl, mobileNumber, paymentInstrument } = await req.json();

        const payload = {
            merchantId,
            merchantTransactionId,
            merchantUserId,
            amount,
            redirectUrl,
            redirectMode,
            callbackUrl,
            mobileNumber,
            paymentInstrument,
        };

        // console.log(payload)

        const dataPayload = JSON.stringify(payload);
        // console.log(dataPayload)
        const dataBase64 = Buffer.from(dataPayload).toString('base64');
        console.log(dataBase64)

        const salt = process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY; // Replace with your actual salt value
        const fullURL = `${dataBase64}/pg/v1/pay${salt}`;
        const dataSha256 = sha256(fullURL).toString();
        const checksum = `${dataSha256}###${process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX}`;

        console.log(checksum)

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_PHONEPE_HOST_URL}/pg/v1/pay`, { request: dataBase64 }, {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                },
            });

            // console.log(response)

            return new Response(JSON.stringify({ success: true, data: response.data }), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
        }
    } else {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed!' }), { status: 405 });
    }
}
