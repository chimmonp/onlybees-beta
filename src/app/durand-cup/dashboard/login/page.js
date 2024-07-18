'use client';

// Images

import logo from '../../../../../public/OnlyBees_light.svg';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";

// Context
import { useOrganizer } from '@/context/OrganizerContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { organizer, loginOrganizer } = useOrganizer();

  const verifyUser = async () => {
    try {
      const res = await fetch('/api/durand-cup/auth/verify', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        loginOrganizer(data.organizer);
        router.push('/durand-cup/dashboard');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to verify token', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // To verify admin jwt token using cookies
    verifyUser();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    // console.log(email, password)
    try {
      const res = await fetch('/api/durand-cup/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        loginOrganizer(data.organizer);
        // router.push('/organizer');
        verifyUser();

      } else {
        const data = await res.json();
        setErrorMessage(data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <section className="bg-black dark w-screen overflow-hidden">
      <div className="flex flex-col items-center lg:justify-center px-6 py-8 mx-auto h-[92svh] lg:py-0">
        <Link href="/" className="flex items-center mb-10 mt-16 lg:mt-0 text-2xl font-semibold text-gray-900 dark:text-white">
          <Image
            className="mr-2"
            src={logo}
            width={300}
            height="auto"
            alt="Onlybees logo"
          />
        </Link>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1e1e1e]">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className=" text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              ORGANIZER LOGIN
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#00FF38] block w-full p-2.5 dark:bg-[#1e1e1e] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#00FF38]"
                  placeholder="Eg: organizer@onlybees.in"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-[#00FF38] focus:border-[#00FF38] block w-full p-2.5 dark:bg-[#1e1e1e] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#00FF38]"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full text-black dark:bg-[#00FF38] bg-[#00FF38] focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
