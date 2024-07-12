// src/api/admin/auth/verify.js
import connectMongo from '../../../../lib/mongodb';
import User from '../../../../models/User';


export const GET = async (req) => {
  try {
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
    }
    
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    await connectMongo();
    if (!phone) {
      return new Response(JSON.stringify({ success: false, error: 'Phone number is required' }), { status: 400 });
    }
    
    //Get user details
    const user = await User.findOne({ phone: phone });

    if(user){
        return new Response(JSON.stringify({ success: true, user: user }), { status: 200 });
    }
    else{
        return new Response(JSON.stringify({ success: false, message: "User not found!" }), { status: 404 });
    }

  } catch (error) {
    // console.error(error);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
  }
};