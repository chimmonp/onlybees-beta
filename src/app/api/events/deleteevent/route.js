import connectMongo from '../../../../lib/mongodb';
import Event from '../../../../models/Event';
import cloudinary from '../../../../lib/cloudinary';

export const DELETE = async (req) => {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Extract event ID from request body
    const { id } = await req.json();

    // Find the event by ID and delete it
    const event = await Event.findByIdAndDelete(id);

    // If event doesn't exist, return 404
    if (!event) {
      return new Response(JSON.stringify({ success: false, error: 'Event not found' }), { status: 404 });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(event.public_id);

    // Return success response
    return new Response(JSON.stringify({ success: true, data: event }), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
  }
};
