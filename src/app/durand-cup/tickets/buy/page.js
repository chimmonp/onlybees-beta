"use client";

import { v4 as uuidv4 } from 'uuid';

import React, { useEffect, useState } from 'react'

import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";

//Context
import { useAuth } from '@/context/AuthContext';
import { useDurand } from "@/context/DurandContext"

import axios from 'axios'

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const page = () => {

    const { durandData, setData, appendData } = useDurand();

    const router = useRouter()
    const pathname = usePathname().split('/').pop();

    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
    });
    const { user, login } = useAuth();
    const [ph, setPh] = useState("");


    //Change state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const saveOrder = async (ticket, orderDetails) => {
        // try {
        //     const res = await axios.post('/api/razorpay/save-order', {
        //         ticket,
        //         orderDetails,
        //         convenienceFee: convFee,
        //         platformFee,
        //         phone: ph,
        //         email: form.email,
        //     });
        // } catch (error) {
        //     console.log("Some error occured")
        // }
    }


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
                setLoading(false);
            }
        } catch (error) {
            return
        }
    };

    const createNewUser = async () => {
        try {
            const res = await fetch('/api/auth/registeruser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...form, phoneNumber: ph }),
            });

            const data = await res.json();
            if (data.success) {
                verifyUser();
                return true;
            }
            else {
                toast.error('Some error occured!');
                return false
            }
        } catch (error) {
            toast.error('Some error occured!');
            return false
        }
    }

    const userExists = async () => {
        try {
            const url = new URL('/api/auth/finduser', window.location.origin);
            url.searchParams.append('phone', ph);

            const res = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });


            if (res.ok) {
                const data = await res.json();
                return data.success;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    //If user exists
    useEffect(() => {
        verifyUser();
        // loadScript();
        console.log(durandData)
    }, [])

    useEffect(() => {
        console.log(durandData)
    }, [durandData])

    useEffect(() => {
        if (user.userData) {
            // console.log(user.userData);
            setForm({
                firstname: user.userData.firstname || '',
                lastname: user.userData.lastname || '',
                email: user.userData.email || '',
            });
            setPh(user.userData.phone)
        }
    }, [user])


    const makePayment = async (e) => {

        // e.preventDefault();
        // alert("make payment")

        const transactionId = "Tr-" + uuidv4().toString(36).slice(-6);

        const orderPayload = {
            transactionId,
            userId: user.userData?._id || '6671a57c0e924ab6086fbd36',
            match: durandData.matchDetails._id,
            status: "PENDING",
            amount: durandData.amount.totalAmtCalc, // example amount
            baseAmount: durandData.amount.subtotalAmt,
            quantity: durandData.tickets,
            section: durandData.sectionData._id,
            currency: "INR",
            notes: `Tickets for Durand Cup on ${durandData.matchDetails.slug}`,
            name: `${form.firstname} ${form.lastname}`,
            phone: ph,
            email: form.email
            // Include other necessary details like eventId, ticketDetails, etc.
        };

        try {

            // Save transaction to the database
            const orderResponse = await axios.post('/api/durand-cup/save-order', orderPayload, {
                // method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(orderPayload),
            });

            if (orderResponse.data.success) {

                const payload = {
                    merchantId: process.env.NEXT_PUBLIC_PHONEPE_MERCHANT_ID,
                    merchantTransactionId: transactionId,
                    merchantUserId: 'OB-' + uuidv4().toString(36).slice(-6),
                    amount: 200,
                    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/phonepe/status/${transactionId}`,
                    redirectMode: "POST",
                    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/phonepe/status/${transactionId}`,
                    mobileNumber: ph,
                    paymentInstrument: {
                        type: "PAY_PAGE",
                    },
                };


                const response = await axios.post('/api/phonepe/pay', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // console.log(response.data.data.data.instrumentResponse.redirectInfo.url)

                const redirectUrl = response.data.data.data.instrumentResponse.redirectInfo.url;
                window.location.href = redirectUrl;
            }
        } catch (error) {
            console.error('Payment request error: ', error.response ? error.response.data : error.message);
        }
    };

    const handleCheckout = async () => {
        // console.log(user)
        if (user.userData) {
            makePayment()
        }
        else {
            userExists().then((exists) => {
                if (exists) {
                    // saveOrder(ticket, { ...orderDetails, paymentId });
                    makePayment()
                } else {
                    createNewUser().then((created) => {
                        // saveOrder(ticket, { ...orderDetails, paymentId });
                        makePayment()
                    })
                }
            });
        }
    }

    if (durandData.length === 0) {
        router.push("/durand-cup/tickets/aug-02")
    }

    if (durandData.length !== 0) {
        return (
            <div className='flex justify-center px-10'>
                <div className='w-screen bg-white lg:w-1/3'>
                    <h2 className='text-black font-semibold text-xl mt-20 mb-5'>Contact information</h2>
                    <div className='flex flex-col items-center justify-center gap-10'>
                        <form className="space-y-4 md:space-y-6 md:w-full">
                            <div className='flex flex-row gap-10'>
                                <div className='w-full'>
                                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-black">First Name :</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        id="firstname"
                                        value={form.firstname || ''}
                                        onChange={handleChange}
                                        className="px-0 border-b border-black sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-white placeholder-gray-400 text-black"
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                                <div className='w-full'>
                                    <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-black">Last Name :</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        id="lastname"
                                        value={form.lastname || ''}
                                        onChange={handleChange}
                                        className="px-0 border-b border-black sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-white placeholder-gray-400 text-black"
                                        placeholder="Last Name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className=''>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">Email :</label>

                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={form.email || ''}
                                    onChange={handleChange}
                                    placeholder="Eg: onlybees@email.com"
                                    className="px-0 border-b border-black sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-white placeholder-gray-400 text-black"
                                    required
                                />
                                <span className='text-[0.7rem]'><span className='text-[#1baf39]'>Note</span> : You&apos;ll receive a copy of the tickets here</span>
                            </div>
                            <div >
                                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-black">Phone :</label>
                                <PhoneInput country={"in"}
                                    value={ph || ''}
                                    onChange={setPh}
                                    inputStyle={{ "color": "black", "background": "none", "border": "none", "fontSize": "1rem" }}
                                    buttonStyle={{ "background": "none", "border": "none" }}
                                    dropdownStyle={{ "color": "black", "background": "white" }}
                                    autoFocus
                                    required
                                    disabled={user.isRegistered}
                                    className={`${user.isRegistered ? "opacity-50" : ""}`}
                                />
                                <hr className="mt-1" />
                            </div>
                        </form>
                        <div className=''>
                            <p className='font-light text-[0.9rem]'>By purchasing you&apos;ll receive an account, and agree to our general <a className='text-[#1baf39]' href="/terms-and-conditions" target='_blank' rel='noopener noreferrer'>Terms of use</a>, <a className='text-[#1baf39]' href="/privacy-policy" target='_blank' rel='noopener noreferrer'>Privacy Policy</a> and the <a className='text-[#1baf39]' href="/terms-and-conditions" target='_blank' rel='noopener noreferrer'>Ticket Purchase Terms</a>. We process your personal data in accordance with our <a className='text-[#1baf39]' href="/privacy-policy" target='_blank' rel='noopener noreferrer'>Privacy Policy</a>.</p>
                        </div>
                    </div>
                </div>
                {pathname === 'buy' && <div className=' lg:py-0 py-3 fixed bottom-0 lg:w-1/3 w-screen bg-white px-5'>
                    <div onClick={handleCheckout} className='bg-[#00FF38] cursor-pointer mt-3 py-5 rounded-md font-semibold text-center'>
                        <p>PAY ₹{durandData.amount.totalAmtCalc}</p>
                    </div>
                </div>}
            </div>
        )
    }
}

export default page