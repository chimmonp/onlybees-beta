import connectMongo from '@/lib/mongodb';
import Section from '@/models/Section';

export const POST = async (req, res) => {
    try {
        await connectMongo();

        const { bowl, tickets, date } = await req.json();

        // Find the section document
        const section = await Section.findById(bowl);

        if (!section) {
            return new Response(JSON.stringify({ success: false, error: 'Section Not Found' }), { status: 404 });
        }

        // Find the corresponding date in availableQuantity
        const dateEntry = section.availableQuantity.find(entry => entry.date === date);

        if (!dateEntry) {
            return new Response(JSON.stringify({ success: false, error: 'Date Not Available' }), { status: 400 });
        }

        // Update the quantity
        if (dateEntry.quantity >= tickets) {
            dateEntry.quantity -= tickets; // Reduce quantity by tickets purchased
            
            // Save the updated section
            await section.save();

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, error: 'Not Enough Tickets Available' }), { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
