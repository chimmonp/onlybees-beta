import connectMongo from '../../../../lib/mongodb';
import Event from '../../../../models/Event';
import cloudinary from '../../../../lib/cloudinary';



// Function to generate a unique slug
const generateUniqueSlug = async (title) => {
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let count = 1;
    while (true) {
        const existingEvent = await Event.findOne({ slug });
        if (!existingEvent) {
            return slug;
        }
        slug = `${slug}-${count}`;
        count++;
    }
};


export const POST = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Extract data from request body
        const { organizer, title, about, venue, city, date, time, image, ticketPhases } = await req.json();
 
        // Generate a unique slug from the event title
        const slug = await generateUniqueSlug(title);

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'events',
        });

        // Format the ticket phases
        const ticketPrice = {};
        ticketPhases.forEach(phase => {
            ticketPrice[phase.phaseName] = {
                info: phase.info,
                coverCharge: phase.coverCharge,
                quantity: phase.quantity,
                price: phase.price,
            };
        });

        // Create a new event instance
        const event = new Event({
            organizer,
            title,
            about,
            venue,
            city,
            date,
            time,
            imageUrl: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
            ticketPrice,
            slug,
        });


        // Save the event to MongoDB
        await event.save();

        // Return success response
        return new Response(JSON.stringify({ success: true, data: event }), { status: 201 });
    
    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
