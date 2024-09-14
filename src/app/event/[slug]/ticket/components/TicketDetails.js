'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useAuth } from '@/context/AuthContext';

//Accordion
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';


//Components
import Loading from '@/app/components/Loading';


const TicketDetails = ({ event, tickets, convFee, platformFee, totalAmt, setTotalAmt, form, setForm, ph, setPh }) => {

    const { user } = useAuth();
    const [baseAmt, setBaseAmt] = useState(totalAmt - convFee - platformFee); // Add state for coupon code
    const [couponCode, setCouponCode] = useState(""); // Add state for coupon code
    const [discount, setDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState("");
    const [validating, setValidating] = useState(false)
    const [applied, setApplied] = useState(false)

    // const [ph, setPh] = useState("");

    // const [form, setForm] = useState({
    //     firstname: null,
    //     lastname: null,
    //     email: null,
    // });


    useEffect(() => {
        if (user.userData) {
            // console.log(user.userData);
            setForm({
                firstname: user.userData.firstname || null,
                lastname: user.userData.lastname || null,
                email: user.userData.email || null,
            });
            setPh(user.userData.phone)
        }
    }, [user])

    //Change state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    // Handle coupon code input change
    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };

    const handleApplyCoupon = async () => {
        setValidating(true)
        try {
            const response = await fetch('/api/events/validate-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ couponCode, eventId: event._id }),
            });

            const result = await response.json();
            if (response.ok) {
                setDiscount(result.discount);
                setCouponMessage(`YAY! You saved ₹${(totalAmt - platformFee - convFee) * (result.discount / 100.0)}`);
                let newAmt = baseAmt - (baseAmt * (result.discount / 100.0))
                // console.log(result.discount, totalAmt, newAmt)
                setTotalAmt(newAmt + convFee + platformFee)
                setApplied(true)
                setValidating(false)
            } else {
                setDiscount(0);
                setCouponMessage(result.message);
                setValidating(false)
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            setDiscount(0);
            setCouponMessage('Failed to apply coupon. Please try again.');
            setValidating(false)
        }
    };

    const handleRemoveCoupon = () => {
        setDiscount(0);
        setCouponMessage(``);
        setApplied(false)
        setTotalAmt(baseAmt + convFee + platformFee)
    }

    //To get formatted date
    const options = {
        weekday: 'short', // Fri
        year: 'numeric',
        month: 'short', // May
        day: '2-digit', // 31
    };
    const date2 = new Date(event.date);
    const formattedDate = date2.toLocaleString('en-US', options);

    // Filter tickets with selected >= 1
    const selectedTickets = tickets.filter(ticket => ticket.selected >= 1);


    return (
        <div className='py-10 flex flex-col items-center justify-center pb-40'>
            {validating && <Loading/>}
            <div className='md:w-[60vw] w-[82vw]'>
                <h1 className='text-[#00FF38] font-semibold text-4xl md:text-left'>CHECKOUT</h1>
                <div className='flex flex-row gap-5 mt-10'>
                    <div className="flyer max-w-[150px] aspect-w-1 aspect-h-1">
                        <Image
                            src={event.imageUrl}
                            loading='lazy'
                            width={200}
                            height={200}
                            alt="Event Flyer"
                        />
                    </div>
                    <div className="p-0 flex flex-col justify-between h-[120px]">
                        <p className="lg:mt-3 text-2xl font-bold mb-1">{event.title}</p>
                        <p className="text-sm font-light mb-1">{event.venue}</p>
                        <p className="text-sm text-[#00FF38] mb-1">{formattedDate}</p>
                        <p className="text-sm">{event.city}</p>
                    </div>
                </div>
                <div className='mt-10'>
                    <h2 className='text-[#00FF38] font-semibold text-xl'>Order Summary</h2>
                    <div className='mt-5 text-sm'>
                        {selectedTickets.map((ticket, index) => (
                            <div key={index} className='flex justify-between py-2'>
                                <span>{ticket.phaseName} <span className='bg-white text-black text-sm font-semibold px-4 rounded-full ml-3'>x{ticket.selected}</span></span>
                                <span>₹{ticket.amount}</span>
                            </div>
                        ))}
                        <Accordion allowZeroExpanded>
                            <AccordionItem key="1" className="bg-black text-white ">
                                <AccordionItemHeading>
                                    <AccordionItemButton className="flex justify-between items-center py-2 cursor-pointer">
                                        <div className="flex flex-row w-full items-center justify-between">
                                            <div className="">Booking Fees<ArrowDropDownIcon /></div>
                                            <div>₹{convFee + platformFee}</div>
                                        </div>
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel className="border border-black border-opacity-20 rounded-[15px]">
                                    <div className="flex flex-col gap-1 justify-center items-center text-slate-300 pb-3">
                                        {totalAmt >= 500 && <div div className="flex flex-row w-full items-center justify-between">
                                            <div className="">GST(18%)</div>
                                            <div>incl.</div>
                                        </div>}
                                        <div className="flex flex-row w-full items-center justify-between">
                                            <div className="">Convenience Fees</div>
                                            <div>₹{convFee}</div>
                                        </div>
                                        <div className="flex flex-row w-full items-center justify-between">
                                            <div className="">Platform Fees</div>
                                            <div>₹{platformFee}</div>
                                        </div>
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                        {discount !== 0 && <div className='flex justify-between border-b border-gray-600 py-2'>
                            <span>Discount</span>
                            <span>₹{baseAmt * (discount / 100.0)}</span>
                        </div>
                        }
                        <div className='flex text-xl justify-between font-bold border-t border-gray-600 py-2'>
                            <span>Total</span>
                            <span>₹{totalAmt}</span>
                        </div>
                    </div>
                </div>

                <h2 className='text-white font-semibold text-md mt-10 mb-2'>Have a Coupon Code?</h2>
                <div className='border border-white border-opacity-25 rounded-md'>
                    <input
                        className={`bg-black text-white w-3/4 px-2 outline-none py-2 ${applied ? 'opacity-20' : 'opacity-100'}`}
                        type="text"
                        name="coupon"
                        id="coupon"
                        placeholder='Enter code here'
                        value={couponCode}
                        onChange={handleCouponChange}
                        disabled={applied}
                    />
                    {!applied ? <button
                        className={`w-1/4 text-xs ${couponCode ? 'opacity-100' : 'opacity-60'}`}
                        onClick={handleApplyCoupon}
                        disabled={!couponCode}
                    >
                        APPLY
                    </button> : <button
                        className={`w-1/4 text-xs ${applied ? 'opacity-100' : 'opacity-0'}`}
                        onClick={handleRemoveCoupon}
                        disabled={!applied}
                    >
                        REMOVE
                    </button>
                    }
                </div>
                {couponMessage && <p className={`mt-2 text-sm ${discount === 0 ? "text-[#bd3a2e]" : "text-[#00ff38]"}`}>{couponMessage}</p>}

                <h2 className='text-[#00FF38] font-semibold text-xl mt-20 mb-5'>Contact information</h2>
                <div className='flex md:flex-row flex-col md:items-center gap-10'>
                    <form className="space-y-4 md:space-y-6 md:w-full">
                        <div className='flex flex-row gap-10'>
                            <div className='w-full'>
                                <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-white">First Name :</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    value={form.firstname || ''}
                                    onChange={handleChange}
                                    className="px-0 border-b border-white sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-black placeholder-gray-400 text-white"
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-white">Last Name :</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    value={form.lastname || ''}
                                    onChange={handleChange}
                                    className="px-0 border-b border-white sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-black placeholder-gray-400 text-white"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>
                        <div className=''>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email :</label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={form.email || ''}
                                onChange={handleChange}
                                placeholder="Eg: onlybees@email.com"
                                className="px-0 border-b border-white sm:text-sm focus:outline-none focus:ring-none block w-full p-2.5 bg-black placeholder-gray-400 text-white"
                                required
                            />
                            <span className='text-[0.7rem]'><span className='text-[#00FF38]'>Note</span> : You&apos;ll receive a copy of the tickets here</span>
                        </div>
                        <div >
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone :</label>
                            <PhoneInput country={"in"}
                                value={ph || ''}
                                onChange={setPh}
                                inputStyle={{ "color": "white", "background": "none", "border": "none", "fontSize": "1rem" }}
                                buttonStyle={{ "background": "none", "border": "none" }}
                                dropdownStyle={{ "color": "white", "background": "black" }}
                                autoFocus
                                required
                                disabled={user.isRegistered}
                                className={`${user.isRegistered ? "opacity-50" : ""}`}
                            />
                            <hr className="mt-1" />
                        </div>
                    </form>
                    <div className='md:p-10 md:w-3/4'>
                        <p className='font-light text-[0.9rem]'>By purchasing you&apos;ll receive an account, and agree to our general <a className='text-[#00FF38]' href="/terms-and-conditions" target='_blank' rel='noopener noreferrer'>Terms of use</a>, <a className='text-[#00FF38]' href="/privacy-policy" target='_blank' rel='noopener noreferrer'>Privacy Policy</a> and the <a className='text-[#00FF38]' href="/terms-and-conditions" target='_blank' rel='noopener noreferrer'>Ticket Purchase Terms</a>. We process your personal data in accordance with our <a className='text-[#00FF38]' href="/privacy-policy" target='_blank' rel='noopener noreferrer'>Privacy Policy</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TicketDetails
