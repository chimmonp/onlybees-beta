"use client"
import { useEffect, useState } from "react";

import Image from "next/image"

//MUI Icons
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

//Components
import SimilarEvents from "./components/SimilarEvents";
import Loading from "../components/Loading";

import Link from "next/link";

// Context
import { useAuth } from '@/context/AuthContext';


const DashboardPage = () => {

  const { user, login } = useAuth();
  const [event, setEvent] = useState(null)
  const [qr, setQr] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formattedDate, setFormattedDate] = useState(null)


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

  const fetchEventData = async (eventId) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/events/eventinfo?eventId=${eventId}`);
      const dataRecv = await res.json();

      if (!dataRecv.success) {
        setEvent(null);
        setIsLoading(false)
      } else {
        setEvent(dataRecv.data);
        setIsLoading(false)
      }
    } catch (error) {
      setEvent(null);
      setIsLoading(false)
    } finally {

    }
  }

  useEffect(() => {
    //Check latest event booked
    if (user?.userData?.bookings) {
      const sortedBookings = user.userData.bookings.sort((a, b) =>
        new Date(b.ticketDetails[0].bookingDate) - new Date(a.ticketDetails[0].bookingDate)
      );
      if (sortedBookings[0]) {
        fetchEventData(sortedBookings[0].eventId)
        setQr(sortedBookings[0].qrLink)
      }
    }
    // console.log(user)
  }, [user]);

  useEffect(() => {
    // console.log(event)
    if (event) {
      const options = {
        weekday: 'short', // Fri
        month: 'short', // May
        day: '2-digit', // 31
      };
      const date2 = new Date(event.date);
      setFormattedDate(date2.toLocaleString('en-US', options));
    }
  }, [event])

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }


  if (isLoading)
    return <Loading />

  if (!event) {
    return (
      <div className="text-white flex flex-col justify-center items-center w-screen pt-10 pb-20">
        {user.userData && <h1 className="text-xl text-medium mb-10 px-10 text-[#D9D9D9] w-full">{getGreeting()}, {user.userData.firstname} </h1>}
        <div className="md:w-[50svw] w-[80svw]">
          <h2 className="mx-9 mb-2">No upcoming events</h2>
          <Link href='/events' className="mx-9 text-sm underline text-[#00FF38]">Browse events and book now <TrendingFlatIcon /></Link>
          <hr className="my-3 mt-10 mx-9" />
          <div className="flex flex-row justify-between mx-9">
            <h2 className="">Need Help?</h2>
            <HelpOutlineIcon />
          </div>
        </div>
        <div className="mt-20 text-left md:w-[50svw] w-[80svw] overflow-hidden">
          <Link href='/help' className="text-xl font-medium">More events</Link>
          <SimilarEvents />
        </div>
      </div>)
  }





  return (
    <div className="text-white flex flex-col justify-center items-center w-screen pt-10 pb-20">
      {user.userData && <h1 className="text-xl text-medium mb-10 px-10 text-[#D9D9D9] w-full">{getGreeting()}, {user.userData.firstname} </h1>}
      <div className="md:w-[50svw] w-[80svw]">
        {qr && <Image
          src={qr}
          height={250}
          width={250}
          className="rounded-lg mx-auto"
          alt='QR Code'
        />}
        <h1 className="ml-9 text-2xl my-2 mb-0 mt-3 uppercase">{event.title}</h1>
        <p className="ml-9 text-[#00FF38] text-lg">{formattedDate}</p>
        <hr className="my-3 mx-9" />
        <h2 className="ml-9 text-sm">{event.venue}, {event.city}</h2>
        <p className="ml-9 text-[#00FF38] my-1 text-sm">Gate opens at {event.time}</p>
        <hr className="my-3 mx-9" />
        <div className="flex flex-row justify-between mx-9">
          <Link href='/help' className="">Need Help?</Link>
          <HelpOutlineIcon />
        </div>
      </div>
      <Link href='dashboard/my-tickets' className="mt-10 md:w-[50svw] w-[80svw] text-lg underline">View All Bookings <TrendingFlatIcon /></Link>
      <div className="mt-20 text-left md:w-[50svw] w-[80svw] overflow-hidden">
        <h2 className=" mb-2 text-xl font-medium">Similar events</h2>
        <hr className="mb-2" />
        <SimilarEvents />
      </div>
    </div>
  )
}

export default DashboardPage