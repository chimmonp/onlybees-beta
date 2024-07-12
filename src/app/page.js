"use client"

import './globals.css';

import { useEffect, useState } from 'react';

import Image from 'next/image';


//Components
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventSection from './components/EventSection';
import OurWorkSection from './components/OurWorkSection';
import WhatWeDo from './components/WhatWeDo';
import Clients from './components/Clients';
import SecondaryText from './components/SecondaryText';
import FormSubmit from './components/FormSubmit';
import Loading from './components/Loading';

//Assets
import text from "../../public/Text.svg"


const Home = () => {

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/fetchevents`);
      const result = await response.json();
      if (result.success) {
        let upcomingEvents = result.upcomingEvents;
        let pastEvents = result.pastEvents;
        let fetchedEvents = [...upcomingEvents, ...pastEvents]
        if (fetchedEvents.length < 20) {
          const repeatedEvents = [...fetchedEvents];
          while (fetchedEvents.length < 20) {
            fetchedEvents = fetchedEvents.concat(repeatedEvents).slice(0, 20);
          }
        } else {
          fetchedEvents = fetchedEvents.slice(0, 20);
        }
        setEvents([...fetchedEvents, ...fetchedEvents]); // Duplicate events for infinite scroll illusion
      } else {
        console.error('Error fetching events:', result.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading)
    return <Loading />

  return (
    <div className='home-page bg-white text-black min-h-[100svh] overflow-x-hidden'>
      <Navbar mode="light" />
      <div className='pt-10 pb-20 home-page'>
        <HeroSection />
        <hr className='mx-10 my-10 border-0 border-b border-black' />
        <EventSection events={events} loading={loading}/>
        <hr className='mx-10 my-10 border-0 border-b border-black' />
        <OurWorkSection />
        <hr className='mx-10 my-10 border-0 border-b border-black' />
        <Image
          src={text}
          width="0"
          height="0"
          sizes="100vw"
          className="h-full w-full object-cover md:w-1/2 md:mx-auto md:px-0 px-10 my-20" alt="WE ARE CREATIVE PROBLEM SOLVERS. ONLY THE BEST."
        />
        <hr className='mx-10 my-10 border-0 border-b border-black' />
        <WhatWeDo />
        <hr className='mx-10 my-10 border-0 border-b border-black' />
        <Clients />
        <hr className='mx-10 my-10 border-0 border-b border-black' />
        <SecondaryText />
        <FormSubmit />
      </div>
      <Footer mode="light" />
    </div>
  );
}

export default Home;
