import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req, res) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    if (!phone) {
        return new Response(JSON.stringify({ success: false, error: 'Phone query parameter is required' }), { status: 400 });
    //   return res.status(400).json({ success: false, message: 'Phone query parameter is required' });
    }

    const user = await User.findOne({ phone })
      .select('firstname lastname sportsBookings');

    if (user) {
        return new Response(JSON.stringify({ success: true, user }), { status: 200 });
    //   return res.status(200).json({ success: true, user });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    //   return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
    // return res.status(500).json({ success: false, message: 'Server error' });
  }
}
