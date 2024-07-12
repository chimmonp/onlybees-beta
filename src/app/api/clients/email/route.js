//api/clients/email/
import { sendEmail } from '@/lib/nodemailer'; // Adjust the import path
import connectMongo from '@/lib/mongodb';
import Email from '@/models/Email';

export const POST = async (req, res) => {
  try {
    await connectMongo();

    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), { status: 400 });
    }

    const newEmail = new Email({ email });
    await newEmail.save();

    // Send the email with PDF and QR code attachments
    await sendEmail('balajiedkiwaosungoh29@gmail.com', `New email from Client - ${email}`);

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Server Error' }), { status: 500 });
  }
};
