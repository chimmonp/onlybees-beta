"use client"

// Context
import { useAuth } from '@/context/AuthContext';


//Components
import TicketItem from "./components/TicketItem";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MyTickets = () => {

  const { user, login } = useAuth();
  const router = useRouter();
  const [ allBookings, setAllBookings ] = useState([])

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
      if(user.userData.bookings.length > 10){
        setAllBookings(user.userData.bookings)
      }
      else{
        let array = user.userData.bookings
        array = array.slice(0, 10)
        setAllBookings(array)
      }
    }
  }, [user])

  return (
    <div className='text-white py-10 px-5'>
      <h1 className="text-5xl mb-5 md:ml-[20vw]">Tickets</h1>
      {allBookings?.map((booking, index) => (
        <TicketItem
          key={index}
          booking={booking}
        />
      ))}
    </div>
  )
}

export default MyTickets