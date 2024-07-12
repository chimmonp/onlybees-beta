import connectMongo from '../../../../lib/mongodb';
import Event from '../../../../models/Event';
import Organizer from '../../../../models/Organizer';
import cloudinary from '../../../../lib/cloudinary';

export const PUT = async (req) => {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Extract data from request body
    const { id, title, about, venue, city, date, time, image, ticketPhases, organizer } = await req.json();

    let imageUrl = image;
    let public_id;

    // If the image is a new file, upload it to Cloudinary
    if (image.startsWith('data:image/')) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'events',
      });
      imageUrl = uploadResponse.secure_url;
      public_id = uploadResponse.public_id;
    } else {
      // If image is not provided, get the current event's public_id
      const existingEvent = await Event.findById(id);
      if (existingEvent) {
        public_id = existingEvent.public_id;
      }
    }

    // Format the ticket phases
    const ticketPrice = {};
    ticketPhases.forEach(phase => {
        ticketPrice[phase.phaseName] = {
            quantity: phase.quantity,
            price: phase.price,
            info: phase.info,
            coverCharge: phase.coverCharge,
        };
    });

    // Update the event in MongoDB
    const event = await Event.findByIdAndUpdate(id, {
      title,
      about,
      venue,
      city,
      date,
      time,
      imageUrl,
      public_id,
      ticketPrice,
      organizer,
    }, { new: true });

    // If event doesn't exist, return 404
    if (!event) {
      return new Response(JSON.stringify({ success: false, error: 'Event not found' }), { status: 404 });
    }

    // Add eventID to organizer's events array if not already present
    const updatedOrganizer = await Organizer.findOneAndUpdate(
      { _id: organizer, events: { $ne: id } }, // Query: Organizer exists and eventID is not in events array
      { $push: { events: id } }, // Update: Add eventID to events array
      { new: true }
    );

    // Return success response
    return new Response(JSON.stringify({ success: true, data: event }), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
  }
};
