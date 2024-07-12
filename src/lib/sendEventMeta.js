import axios from 'axios';

const sendMetaEvent = async (eventName, eventDetails) => {
  const accessToken = process.env.NEXT_PUBLIC_META_ACCESS_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(new Date().getTime() / 1000),
        user_data: {
          em: 'test@example.com', // Replace with hashed user email if available
          ph: '1234567890', // Replace with hashed user phone number if available
        },
        custom_data: eventDetails,
        action_source: 'website',
      },
    ],
  };

  try {
    await axios.post(
      `https://graph.facebook.com/v13.0/${pixelId}/events?access_token=${accessToken}`,
      payload
    );
  } catch (error) {
    console.error('Error sending event to Meta Conversion API', error);
  }
};

export default sendMetaEvent;