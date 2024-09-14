// /pages/api/validateCoupon.js
import connectMongo from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

// export const dynamic = 'force-dynamic';

export const POST = async (req) => {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Extract couponCode and eventId from the request body
    const { couponCode, eventId } = await req.json();

    console.log(couponCode, eventId)

    if (!couponCode || !eventId) {
      return new Response(JSON.stringify({ success: false, message: 'Coupon code and event ID are required!' }), { status: 400 });
    }

    // Find the coupon in the database
    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Coupon Code!' }), { status: 404 });
    }

    // Check if the coupon is associated with the correct event
    if (coupon.eventId.toString() !== eventId) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Coupon Code!' }), { status: 400 });
    }

    // Check if the coupon is active
    if (coupon.status !== 'active') {
      return new Response(JSON.stringify({ success: false, message: 'Invalid Coupon Code!' }), { status: 400 });
    }

    // Check if the coupon is expired
    if (new Date(coupon.expirationDate) < new Date()) {
      return new Response(JSON.stringify({ success: false, message: 'Coupon has expired!' }), { status: 400 });
    }

    // Check if the usage limits are reached
    // if (coupon.usageLimitTotal <= 0) {
    //   return new Response(JSON.stringify({ success: false, message: 'Coupon usage limit reached!' }), { status: 400 });
    // }

    // Optionally, check if the user has already used this coupon (requires tracking in your system)
    // if (userId && coupon.usageLimitPerUser > 0) {
    //   // Implement user usage check logic here if required
    // }

    // Return the discount details if the coupon is valid
    return new Response(JSON.stringify({ success: true, message: 'Coupon is valid!', discount: coupon.percentageDiscount }), { status: 200 });

  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
  }
};
