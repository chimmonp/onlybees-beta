import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import RSVP from '@/models/RSVP';

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongo();
    
    // Parse the incoming request data
    const data = await request.json();
    
    // Create and save a new RSVP document
    const newRSVP = new RSVP(data);
    await newRSVP.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}