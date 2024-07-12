// src/api/admin/auth/login.js
import connectMongo from '../../../../../lib/mongodb';
import Admin from '../../../../../models/Admin';
import { comparePassword } from '../../../../../lib/bcrypt';
import { generateToken } from '../../../../../lib/auth';

export const POST = async (req) => {
  try {

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
    }

    const { username, password } = await req.json();

    await connectMongo();

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Username' }), { status: 401 });
    }

    const isValid = await comparePassword(password, admin.password);

    if (!isValid) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Password' }), { status: 401 });
    }


    const token = generateToken(admin);

    const cookieOptions = {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600, // 1 hour
      sameSite: 'strict', // Adjust according to your needs
      path: '/', // The path scope of the cookie
    };
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; ${cookieOptions.httpOnly?"HttpOnly;":""} Max-Age=${cookieOptions.maxAge}; Path=${cookieOptions.path}; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite};`,
      },
    });

    // return new Response(JSON.stringify({ success: true, token: token }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
  }


}
