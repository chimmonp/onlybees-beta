// src/app/dashboard/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

//React icons
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard, MdEventNote } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { IoTicketSharp } from "react-icons/io5";


// Components
// import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';
import Loading from '@/app/components/Loading';


export default function DashboardPage({ children }) {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {

    //To verify admin jwt token using cookies
    const verifyUser = async () => {
      try {
        const res = await fetch('/api/admin/auth/verify', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setLoading(false);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Failed to verify token', error);
        router.push('/admin/login');
      }
    };

    verifyUser();


    //For the dashboard template script
    // const script = document.createElement('script');
    // script.src = "https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js";
    // script.defer = true;

    // document.body.appendChild(script);

    // return () => {
    //   document.body.removeChild(script);
    // };


  }, [router]);


  if (loading) {
    return <Loading />
  }



  // Sidebar items
  const menus = [
    { name: "Dashboard", link: "/admin/dashboard", icon: MdOutlineDashboard },
    { name: "Events", link: "/admin/dashboard/events", icon: MdEventNote },
    { name: "Bookings", link: "/admin/dashboard/bookings", icon: IoTicketSharp },
    // { name: "Sign out", link: "/", icon: AiOutlineUser },
    // { name: "messages", link: "/", icon: FiMessageSquare },
    // { name: "analytics", link: "/", icon: TbReportAnalytics, margin: true },
    // { name: "File Manager", link: "/", icon: FiFolder },
    // { name: "Cart", link: "/", icon: FiShoppingCart },
    // { name: "Saved", link: "/", icon: AiOutlineHeart, margin: true },
    // { name: "Setting", link: "/", icon: RiSettings4Line },
  ];




  return (
    <div className="dark bg-black">
      <section className="flex">
        <div
          className={`bg-[#121212] min-h-screen ${open ? "w-72" : "w-16"
            } duration-500 text-gray-100 px-4`}
        >
          <div className="py-3 flex justify-end">
            <HiMenuAlt3
              size={26}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
          <div className="mt-4 flex flex-col gap-4 relative overflow-x-hidden">
            {menus?.map((menu, i) => (
              <Link
                href={menu?.link}
                key={i}
                className={` ${menu?.margin && "mt-5"
                  } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
              >
                <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                <h2
                  style={{
                    transitionDelay: `${i + 5}0ms`,
                  }}
                  className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                >
                  {menu?.name}
                </h2>
                <h2
                  className={`${open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                >
                  {menu?.name}
                </h2>
              </Link>
            ))}
          </div>
        </div>
        <div className={`text-white w-full overflow-hidden`}>
          {children}
        </div>
      </section>
    </div>
  )
}
