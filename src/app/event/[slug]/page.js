// "use client"

// import { useEffect, useState } from "react";

//Components
import Navbar from "../../components/Navbar";
import EventDetails from "../../components/EventDetails";
import Footer from "../../components/Footer";

import sendMetaEvent from "@/lib/sendEventMeta";


export async function generateMetadata({ params }) {

  const { slug } = params;


  // try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events/eventinfo?slug=${slug}`);
    const result = await response.json();

    if (!result.success) {
      return {
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      };
    }

    const eventData = result.data;
    sendMetaEvent('PageView', eventData.title);

    return {
      metadataBase: new URL('https://event.onlybees.in'),
      alternates: {
        canonical: '/',
        languages: {
          'en-US': '/en-US',
          'de-DE': '/de-DE',
        },
      },
      openGraph: {
        images: "/BeesLogoBg.png",
        title: eventData.title,
        description: eventData.description,
      },
      title: `${eventData.title} - Book Tickets on Onlybees.in`,
      description: eventData.description,
      twitter: {
        images: "/BeesLogoBg.png",
        card: "summary_large_image",
        site: "@OnlyBees",
        title: eventData.title,
        description: eventData.description,
      },
      date: eventData.date,
      location: eventData.venue,
      organizer: eventData.organizer,
      audience: "Music enthusiasts, Party-goers, Cultural explorers, Local and National artists",
      socialMediaHashtags: ["#Rave", "#MeghalayaMusic", "#Events"],
    };
  // } catch (error) {
  //   return {
  //     title: 'Error',
  //     description: 'An error occurred while fetching event details.',
  //   };
  // }
}



export default function Event({ params }) {

  const { slug } = params;




  return (
    <div className="bg-black text-white">
      <Navbar mode="dark" />
      <EventDetails slug={slug} />
      <Footer mode="dark" />
    </div>
  );
}
