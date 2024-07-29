// src/api/admin/auth/login.js
import connectMongo from '@/lib/mongodb';
import Organizer from '@/models/Organizer';
import { comparePassword } from '@/lib/bcrypt';
import { generateOrganizerToken } from '@/lib/auth';

export const POST = async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
    }

    const { email, password } = await req.json();

    // console.log(email, password)

    await connectMongo();

    const emailValid = email === process.env.NEXT_PUBLIC_DURAND_AUTH_EMAIL || email === process.env.NEXT_PUBLIC_DURAND_AUTH_EMAIL2 || email === process.env.NEXT_PUBLIC_DURAND_AUTH_EMAIL3
    
    if (!emailValid) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Email' }), { status: 401 });
    }

    const organizer = await Organizer.findOne({ email });


    const isValid = password === process.env.NEXT_PUBLIC_DURAND_AUTH_PASSWORD || password === process.env.NEXT_PUBLIC_AUTH_SECRET || password === process.env.NEXT_PUBLIC_DURAND_AUTH_PASSWORD2 || password === process.env.NEXT_PUBLIC_DURAND_AUTH_PASSWORD3;

    if (!isValid) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Password' }), { status: 401 });
    }

    const token = generateOrganizerToken(organizer);

    const cookieOptions = {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Adjust according to your needs
      path: '/', // The path scope of the cookie
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    };

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `durandToken=${token}; ${cookieOptions.httpOnly ? 'HttpOnly;' : ''} Path=${cookieOptions.path}; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge};`,
      },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
  }
}
