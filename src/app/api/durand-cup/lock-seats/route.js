import connectMongo from '@/lib/mongodb';
import Section from '@/models/Section';

export const POST = async (req, res) => {
    try {
        await connectMongo();

        const { bowl, tickets, date } = await req.json();

        // Update the quantity for the specific date in the specific bowl
        const result = await Section.updateOne(
            { _id: bowl, 'availableQuantity.date': date },
            { $inc: { 'availableQuantity.$.quantity': -tickets } }
        );

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ success: false, error: 'Update Failed' }), { status: 400 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
