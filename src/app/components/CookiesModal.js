'use client'

import { useState, useEffect } from 'react';

// MUI Icons
import CookieIcon from '@mui/icons-material/Cookie';

const CookiesModal = () => {

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (!cookieAccepted) {
      setShowModal(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 bg-black text-white p-4 md:px-10 md:py-5 flex md:flex-row flex-col justify-between items-center shadow-lg">
      <div className='flex gap-5 flex-row items-center'>
        <CookieIcon sx={{'fontSize': '3rem'}}/>
        <div className='flex flex-col'>
            <p className='text-lg font-semibold'>We use cookies</p>
            <p className="text-sm">
            This website uses cookies to help personalise content, tailor and measure ads, and provide a safer experience.{' '}
            </p>
        </div>
      </div>
      <button
        onClick={handleAcceptCookies}
        className="bg-white md:mt-0 mt-5 text-black md:px-10 md:w-auto w-[90%] py-2 rounded hover:bg-gray-200"
      >
        Okay
      </button>
    </div>
  );
};

export default CookiesModal;
