"use client"

import { useRouter, usePathname } from 'next/navigation';

//Toast
import { toast, Toaster } from "react-hot-toast";

import React, { useEffect, useState } from 'react'
import OrganizerNav from "./components/OrganizerNav"
import OrganizerPhoneNav from "./components/OrganizerPhoneNav"
import OrganizerSidebar from "./components/OrganizerSidebar"

//Components
import Loading from '@/app/components/Loading';
import LogoutConfirmation from "@/app/components/LogoutConfirmation";

//Context
import { useOrganizer } from '@/context/OrganizerContext';


const OrganzerLayout = ({ children }) => {

  const [loading, setLoading] = useState(true);
  // const [organizer, setOrganizer] = useState(null);
  const { organizer, loginOrganizer, logoutOrganizer } = useOrganizer()
  const router = useRouter();
  const pathname = usePathname()
  const [logoutModal, setLogoutModal] = useState(false);

  const verifyUser = async () => {
    try {
      const res = await fetch('/api/organizer/auth/verify', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        loginOrganizer(data.organizer);
        setLoading(false);
      } else {
        setLoading(false);
        router.push('/organizer/login');
      }
    } catch (error) {
      console.error('Failed to verify token', error);
      router.push('/organizer/login');
    }
  };

  useEffect(() => {
    verifyUser();
  }, [router]);

  const handleSetLogoutModal = () => {
    setLogoutModal(true);
  }


  const handleLogout = async () => {
    setLogoutModal(false);
    try {
      const res = await fetch('/api/organizer/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        logoutOrganizer();
        toast.success("Logged out user!")
        router.push('/organizer/login');
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to logout user!")
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='bg-black text-white'>
      <Toaster toastOptions={{ duration: 4000 }} />
      {logoutModal && <LogoutConfirmation
        title="Logout Account"
        message="Are you sure you want to logout? Click confirm to logout"
        handleCancel={() => {
          setLogoutModal(false);
        }}
        handleConfirm={handleLogout}
      />}
      <OrganizerNav pathname={pathname} handleSetLogoutModal={handleSetLogoutModal} />
      {pathname !== '/organizer/login' && <OrganizerPhoneNav />}
      <div className='flex md:flex-row min-h-[calc(100svh-65px)] md:pb-0 pb-[12svh]'>
        {pathname !== '/organizer/login' && <OrganizerSidebar />}
        <div className=''>
          {children}
        </div>
      </div>
    </div>
  )
}

export default OrganzerLayout;