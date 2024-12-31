import connectMongo from '../../../../lib/mongodb';
import Event from '../../../../models/Event';

export const dynamic = 'force-dynamic';

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
    const events = await Event.find(filter);

    // Get the current date and add one day
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);


    // Separate events into upcoming and past events
    const upcomingEvents = events.filter(event => new Date(event.date) >= currentDate);
    const pastEvents = events.filter(event => new Date(event.date) < currentDate);

    // Sort upcoming events in ascending order
    upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Sort past events in descending order
    pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Return the events in the response
    return new Response(JSON.stringify({ success: true, upcomingEvents: upcomingEvents, pastEvents: pastEvents }), { status: 200 });
  
  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
  }
};
