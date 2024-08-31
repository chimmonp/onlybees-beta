// import connectMongo from '@/lib/mongodb';
// import Section from '@/models/Section';
// import SeatLock from '@/models/SeatLock';

// export const POST = async (req) => {
//     try {
//         await connectMongo();

        
//         const { sectionId, date, transactionId } = await req.json();
//         console.log(sectionId, date, transactionId)

//         if (!sectionId || !date || !transactionId) {
//             return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
//         }

//         // Find the seat lock
//         const seatLock = await SeatLock.findOne({ transactionId });

//         if (!seatLock) {
//             return new Response(JSON.stringify({ success: false, error: 'Seat lock not found' }), { status: 404 });
//         }

//         // Update the lockedSeats count in the Section document
//         await Section.updateOne(
//             { _id: sectionId, "availableQuantity.date": date },
//             { $inc: { "availableQuantity.$.lockedSeats": -seatLock.lockedSeats } }
//         );

//         // Delete the seat lock document
//         await SeatLock.deleteOne({ _id: seatLock._id });

//         return new Response(JSON.stringify({ success: true, message: 'Seats unlocked successfully' }), { status: 200 });

//     } catch (error) {
//         console.error(error);
//         return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
//     }
// };

import connectMongo from '@/lib/mongodb';
import Section from '@/models/Section';
import SeatLock from '@/models/SeatLock';

export const POST = async (req) => {
    try {
        await connectMongo();

        const { transactionId } = await req.json();

        if (!transactionId) {
            console.error("Missing transaction ID in request");
            return new Response(JSON.stringify({ success: false, error: 'Missing transaction ID' }), { status: 400 });
        }

        // console.log("Received transactionId:", transactionId);

        // Find the seat lock using only transactionId
        const seatLock = await SeatLock.findOne({ transactionId });

        if (!seatLock) {
            console.error("Seat lock not found for transactionId:", transactionId);
            return new Response(JSON.stringify({ success: false, error: 'Seat lock not found' }), { status: 404 });
        }

        // console.log("Found seatLock:", seatLock);

        // Update the lockedSeats count in the Section document
        await Section.updateOne(
            { _id: seatLock.sectionId, "availableQuantity.date": seatLock.date },
            { $inc: { "availableQuantity.$.lockedSeats": -seatLock.lockedSeats } }
        );

        console.log(`Unlocked ${seatLock.lockedSeats} seats for section ${seatLock.sectionId} on date ${seatLock.date}`);

        // Delete the seat lock document
        await SeatLock.deleteOne({ _id: seatLock._id });

        console.log("Deleted seat lock document with ID:", seatLock._id);

        return new Response(JSON.stringify({ success: true, message: 'Seats unlocked successfully' }), { status: 200 });

    } catch (error) {
        console.error("Server error:", error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
};
