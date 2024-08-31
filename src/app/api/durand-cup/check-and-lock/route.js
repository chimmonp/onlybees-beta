import connectMongo from '@/lib/mongodb';
import Section from '@/models/Section';
import SeatLock from '@/models/SeatLock';

export const POST = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        // Parse the request body
        const { sectionId, date, transactionId, requestedSeats } = await req.json();

        if (!sectionId || !date || !transactionId || !requestedSeats) {
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
        }

        // Find the section and check available seats
        const section = await Section.findOne({
            _id: sectionId,
            "availableQuantity.date": date
        });

        if (!section) {
            return new Response(JSON.stringify({ success: false, error: 'Section not found' }), { status: 404 });
        }

        const availableQuantity = section.availableQuantity.find(q => q.date === date);
        const seatsLeft = availableQuantity.quantity - availableQuantity.lockedSeats;

        if (seatsLeft < requestedSeats) {
            return new Response(JSON.stringify({ success: false, error: 'Not enough seats available' }), { status: 400 });
        }

        // Lock the seats for the user
        const now = new Date();
        const lockDuration = 10 * 60 * 1000; // 10 minutes
        const expiresAt = new Date(now.getTime() + lockDuration);

        await SeatLock.create({
            sectionId: sectionId,
            date: date,
            transactionId: transactionId,
            lockedSeats: requestedSeats,
            lockTime: now,
            expiresAt: expiresAt
        });

        // Update the lockedSeats count in the Section document
        await Section.updateOne(
            {
                _id: sectionId,
                "availableQuantity.date": date
            },
            {
                $inc: { "availableQuantity.$.lockedSeats": requestedSeats }
            }
        );

        return new Response(JSON.stringify({ success: true, message: 'Seats locked successfully' }), { status: 200 });

    } catch (error) {
        // Handle errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
