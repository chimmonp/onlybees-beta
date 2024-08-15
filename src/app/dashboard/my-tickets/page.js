"use client"

// Context
import { useAuth } from '@/context/AuthContext';


//Components
import TicketItem from "./components/TicketItem";
import SportsTicketItem from "./components/SportsTicketItem";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MyTickets = () => {

  const { user, login } = useAuth();
  const router = useRouter();
  const [eventBookings, setEventBookings] = useState([]);
  const [sportsBookings, setSportsBookings] = useState([]);

  //To verify user jwt token using cookies
  const verifyUser = async () => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        login(data.user, true);
      }
      sessionStorage.setItem('isChecked', 'true');
    } catch (error) {
      return
    }
  };


  useEffect(() => {
    // if (sessionStorage.getItem('isChecked')) {
    //   return;
    // }
    if (!user.userData) {
      verifyUser();
    }
  }, [])

  // if (user.userData)
  //   console.log(user.userData)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }

    //Show only 10 tickets maximum
    if(user.userData){
      // console.log(user.userData.bookings)
      // if(user.userData.bookings.length > 10){
      //    const limitedEventBookings = user.userData.bookings.slice(0, 10);
      // }
      // else{
      //   let array = user.userData.bookings
      //   array = array.slice(0, 10)
      //   setAllBookings(array)
      // }
      if (user.userData) {
        // Limit event bookings to a maximum of 10
        const limitedEventBookings = user.userData.bookings.slice(0, 10);
        setEventBookings(limitedEventBookings);
  
        // Do not limit sports bookings
        setSportsBookings(user.userData.sportsBookings);
      }
    }
  }, [user])

  return (
    <div className='text-white py-10 px-5'>
      <h1 className="lg:text-5xl text-3xl mb-5 md:ml-[20vw]">Event Tickets</h1>
      {eventBookings.length > 0 ? (
        eventBookings.map((booking, index) => (
          <TicketItem
            key={index}
            booking={booking}
          />
        ))
      ) : (
        <p>No event tickets available.</p>
      )}

      <h1 className="lg:text-5xl text-3xl mb-5 md:ml-[20vw] mt-10">Sports Tickets</h1>
      {sportsBookings.length > 0 ? (
        sportsBookings.map((booking, index) => (
          <SportsTicketItem
            key={index}
            booking={booking}
          />
        ))
      ) : (
        <p>No sports tickets available.</p>
      )}
    </div>
  )
}

export default MyTickets