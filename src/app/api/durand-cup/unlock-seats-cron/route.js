// src/app/api/unlockSeats/route.js

import connectMongo from '@/lib/mongodb';  // Adjust the path as needed
import Section from '@/models/Section';    // Adjust the path as needed
import SeatLock from '@/models/SeatLock';  // Adjust the path as needed

export const POST = async (req) => {
    try {
        // Connect to MongoDB
        await connectMongo();

        const now = new Date();
        const expiredLocks = await SeatLock.find({ expiresAt: { $lte: now } });

        for (const lock of expiredLocks) {
            await Section.updateOne(
                { _id: lock.sectionId, "availableQuantity.date": lock.date },
                { $inc: { "availableQuantity.$.lockedSeats": -lock.lockedSeats } }
            );

            await SeatLock.deleteOne({ _id: lock._id });
        }

        return new Response(JSON.stringify({ message: `Unlocked ${expiredLocks.length} seats.` }), { status: 200 });
    } catch (error) {
        console.error('Error unlocking seats:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
};
