import connectMongo from '../../../../lib/mongodb';
import User from '../../../../models/User';


export const GET = async (req) => {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Extract query parameters
    const url = new URL(req.url);
    const city = url.searchParams.get('city');

    // Create a filter object
    const filter = {};
    if (city) filter.city = city;

    // Fetch events based on the filter and sort according to date
    const events = await Event.find(filter).sort({ date: 1 });

    // Return the events in the response
    return new Response(JSON.stringify({ success: true, data: events }), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
  }
};
