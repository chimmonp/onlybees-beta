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
        const dataBase64 = Buffer.from(dataPayload).toString('base64');

        // console.log(dataBase64)

        const salt = '24da7cf7-2776-4494-890a-1b13627baa86'; // Replace with your actual salt value
        const fullURL = `${dataBase64}/pg/v1/pay${salt}`;
        const dataSha256 = sha256(fullURL).toString();
        const checksum = `${dataSha256}###1`;

        // console.log(checksum)

        try {
            const response = await axios.post('https://api.phonepe.com/apis/hermes/pg/v1/pay', { request: dataBase64 }, {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                },
            });

            return new Response(JSON.stringify({ success: true, data: response.data }), { status: 200 });
            //   res.status(200).json(response.data);
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
        }
    } else {
        // res.setHeader('Allow', ['POST']);
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed!' }), { status: 405 });
        // res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
