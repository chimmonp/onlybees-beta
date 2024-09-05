import connectMongo from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Table from '@/models/Table'; // Import the Table model to fetch ObjectId

export async function POST(req, res) {
    try {
        await connectMongo();

        const { transactionId, userId, status, amount, selectedTable, section, currency, notes, name, phone, email, startTime, endTime } = await req.json();
        
        if (!transactionId || !userId || !status || !amount || !selectedTable || !section || !currency || !notes || !name || !phone || !email || startTime === undefined || endTime === undefined) {
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
        }

        console.log(transactionId, userId, status, amount, selectedTable, section, currency, notes, name, phone, email, startTime, endTime);

        // Fetch the table ObjectId from the database using the selectedTable identifier
        const table = await Table.findOne({ name: selectedTable });

        if (!table) {
            return new Response(JSON.stringify({ success: false, error: 'Table not found' }), { status: 404 });
        }

        const newReservation = new Reservation({
            transactionId,
            user_id: userId, // Update this to match your schema
            status,
            amount,
            currency,
            notes,
            name,
            phone,
            email,
            table_id: table._id, // Use ObjectId from database
            section_id: section,
            start_time: startTime,
            end_time: endTime,
            date: new Date() // Assuming current date for simplicity, modify as needed
        });

        await newReservation.save();

        return new Response(JSON.stringify({ success: true, order: newReservation }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
    }
}
