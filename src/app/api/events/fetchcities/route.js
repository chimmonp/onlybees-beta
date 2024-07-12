import connectMongo from '../../../../lib/mongodb';
import Event from '../../../../models/Event';

export const GET = async () => {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Fetch unique cities from the events collection
    let cities = await Event.distinct('city');
    
    //Sort in alphabetical order
    cities = cities.sort((a, b) => a.localeCompare(b));

    // Return the cities in the response
    return new Response(JSON.stringify({ success: true, data: cities }), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
  }
};
