// src/api/durand-cup/save-order/route.js
import connectMongo from '@/lib/mongodb';
import DurandOrder from '@/models/DurandOrder';

export async function POST(req, res) {
    try {
        await connectMongo();

        const { transactionId, userId, match, status, amount, baseAmount, quantity, section, currency, notes, name, phone, email } = await req.json();
        
        if (!transactionId || !userId || !match || !status || !amount || !baseAmount || !quantity || !section || !currency || !notes || !name || !phone || !email) {
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
        }

        const newOrder = new DurandOrder({
            transactionId,
            userId,
            match,
            status,
            amount,
            baseAmount,
            quantity,
            section,
            currency,
            notes,
            name,
            phone,
            email
        });

        await newOrder.save();

        return new Response(JSON.stringify({ success: true, order: newOrder }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
