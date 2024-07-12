// src/api/organizers/updateOrganizer.js

import connectMongo from '@/lib/mongodb';
import Organizer from '@/models/Organizer';
import { hashPassword } from '@/lib/bcrypt';

export const PUT = async (req) => {
    try {
        // Check if the request method is PUT
        if (req.method !== 'PUT') {
            return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), { status: 405 });
        }

        // Connect to MongoDB
        await connectMongo();

        // Extract data from request body
        const { name, email, phone, city, password } = await req.json();
        
        // Check if the organizer exists by email or phone (assuming unique identifiers)
        const existingOrganizer = await Organizer.findOne({ $or: [{ email: email }, { phone: phone }] });
        
        if (!existingOrganizer) {
            return new Response(JSON.stringify({ success: false, message: 'Organizer not found' }), { status: 404 });
        }

        // Validate the input fields (optional based on your needs)
        // You can add more validation if required

        // Initialize hashedPassword variable
        let hashedPassword;

        // Hash the password if provided
        if (password) {
            hashedPassword = await hashPassword(password);
        }

        // Update the existing organizer's information
        existingOrganizer.name = name;
        existingOrganizer.email = email;
        existingOrganizer.phone = phone;
        existingOrganizer.city = city;

        // If hashedPassword exists (password provided), update it
        if (hashedPassword) {
            existingOrganizer.password = hashedPassword;
        }

        // Save the updated organizer to MongoDB
        await existingOrganizer.save();

        // Return success response
        return new Response(JSON.stringify({ success: true, message: "Organizer updated" }), { status: 200 });

    } catch (error) {
        // Handle server errors
        console.error(error);
        return new Response(JSON.stringify({ success: false, error: "Server Error" }), { status: 500 });
    }
};
