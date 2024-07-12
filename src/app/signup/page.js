"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

//Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loading from '../components/Loading';

//Context
import { useAuth } from '@/context/AuthContext';

import logo from "../../../public/OnlyBees_light.svg";
import { toast, Toaster } from "react-hot-toast";

const SignUpPage = () => {

    const [ cookieExists, setCookieExists ] = useState(false);
    const router = useRouter();

    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);

    //To verify user jwt token using cookies
    const verifyUser = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                setCookieExists(true);
                setLoading(false);
            }
            else{
                setLoading(false);
            }
        } catch (error) {
            setCookieExists(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyUser();
        if(cookieExists && user.isRegistered){
            router.push("/dashboard")
        }
    }, [])


    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: user.userData,
    });

    useEffect(() => {
        // console.log(user)
        if (user) {
            setForm(prevForm => ({
                ...prevForm,
                phoneNumber: user.userData
            }));
        }
    }, [user]);

    //Change state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };


    //Submit form and call api endpoint
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/registeruser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (data.success) {
                setLoading(false);
                login(user.userData, true)
                toast.success('User registered!');
            } else {
                setLoading(false);
                toast.error('Some error occured!');
            }
        } catch (error) {
            setLoading(false);
            toast.error('Some error occured!');
        }
    }

    if (loading) {
        return <Loading />
    }



    if(!cookieExists && !user.isRegistered){
        return (
            <>
                <Toaster toastOptions={{ duration: 4000 }} />
                <Navbar mode="dark" />
                <section className="bg-[#1e1e1e] dark:bg-black min-h-[70svh]">
                    <div className="flex md:flex-row flex-col items-center justify-center px-10 py-10 pb-16 mx-auto lg:py-10 min-h-[70svh]">
                        <div className='md:w-[33vw]'>
                            <Image
                                className="lg:mx-0 mx-2"
                                src={logo}
                                width={300}
                                height="auto"
                                alt="Onlybees logo"
                            />
                            <p className='md:text-left md:pr-4 text-center font-light mt-5'>Looks like you&apos;re new here. Welcome! We&apos;ll get you set up with just some basic info.</p>
                        </div>
                        <hr className="md:hidden h-px mt-10 border-gray-600 border-1 w-full" />
                        <div className="mt-5 w-full rounded-lg shadow sm:max-w-md xl:p-0">
                            <div className=" space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Create an account
                                </h1>
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name*</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            value={form.firstname}
                                            onChange={handleChange}
                                            className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-[#121212] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="First Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            value={form.lastname}
                                            onChange={handleChange}
                                            className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-[#121212] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Last Name"
                                        />
                                    </div>
                                    <div className=''>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Eg: onlybees@email.com"
                                            className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-[#121212] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5 mt-5">
                                            <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded  focus:ring-3 focus:ring-primary-300 bg-[#1e1e1e] dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                        </div>
                                        <div className="ml-3 text-sm mt-5">
                                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" target="_blank" rel="noreferrer noopener" href="/terms">Terms and Conditions</Link></label>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full text-black bg-[#00FF38] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800">Create an account</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer mode="dark" />
            </>
        )
    } else {
        router.push('/events')
    }
}

export default SignUpPage