// src/api/organizers/registerOrganizer.js
import connectMongo from '@/lib/mongodb';
import Organizer from '@/models/Organizer';
import { hashPassword } from '@/lib/bcrypt';

export const POST = async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        await connectMongo();

        const { name, email, phone, city, password, secret } = await req.json();
        
        // Check if the organizer already exists
        const existingOrganizer = await Organizer.findOne({ $or: [{ email: email }, { phone: phone }] });
        
         if (existingOrganizer) {
             return new Response(JSON.stringify({ success: false, message: 'Organizer already exists' }), { status: 400 });
         }


        if (secret !== process.env.SEED_SECRET) {
            return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403 });
        }

        // Validate the input
        if (!name || !email || !phone || !city || !password) {
            console.log("Missing fields!", name, email, phone, city, password);
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        const organizer = new Organizer({
            name: name,
            email: email,
            phone: phone,
            city: city,
            password: hashedPassword,
        });

        await organizer.save();

        return new Response(JSON.stringify({ success: true, message: "Organizer created" }), { status: 201 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
    }
};
