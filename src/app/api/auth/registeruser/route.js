// src/api/users/registeruser.js
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import { generateUserToken } from '@/lib/auth';

export const POST = async (req) => {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        // console.log(req.json())

        const { firstname, lastname, email, phoneNumber } = await req.json();

        // Validate the input
        if (!firstname || !phoneNumber) {
            console.log("Missing fields!", firstname, phoneNumber)
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
        }

        await connectMongo();

        // Check if the user already exists
        const existingUser = await User.findOne({ phone: phoneNumber });

        if (existingUser) {
            return new Response(JSON.stringify({ success: false, message: 'User already exists' }), { status: 400 });
        }

        const user = new User({
            phone: phoneNumber,
            firstname: firstname,
            lastname: lastname,
            email: email,
        });

        await user.save();

        const token = generateUserToken(phoneNumber);
        const cookieOptions = {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3600 * 24 * 60, // 60 days
            sameSite: 'strict',
            path: '/', // The path scope of the cookie
        };
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Set-Cookie': `userToken=${token}; ${cookieOptions.httpOnly ? "HttpOnly;" : ""} Max-Age=${cookieOptions.maxAge}; Path=${cookieOptions.path}; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite};`,
            },
            registered: true,
        });

        // return new Response(JSON.stringify({ success: true, message: "User created successfully" }), { status: 201 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
    }
};
