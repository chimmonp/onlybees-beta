// src/api/admin/auth/verify.js
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export const GET = async (req) => {
  try {
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
    }

    const token = await req.cookies._parsed.get('token').value;

    if (!token) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized! No token' }), { status: 401 });
    }

    const decoded = verifyToken(token);
    
    return new Response(JSON.stringify({ success: true, user: decoded }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
  }
};
