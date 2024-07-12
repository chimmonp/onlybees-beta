"use client"

import React, { useEffect, useState } from 'react'

import Image from 'next/image';



const TicketItem = ({ booking }) => {

    const [event, setEvent] = useState(null)
    const [order, setOrder] = useState(null)
    const [formattedDate, setFormattedDate] = useState(null)
    const [tickets, setTickets] = useState('')

    const fetchEventData = async (eventId) => {
        try {
            const res = await fetch(`/api/events/eventinfo?eventId=${eventId}`);
            const dataRecv = await res.json();

            if (!dataRecv.success) {
                setEvent(null);
            } else {
                setEvent(dataRecv.data);
            }
        } catch (error) {
            setEvent(null);
        } finally {

        }
    }

    const fetchOrder = async (orderId) => {
        try {
            const res = await fetch(`/api/razorpay/bookinginfo?orderId=${orderId}`);
            const dataRecv = await res.json();

            if (!dataRecv.success) {
                setOrder(null);
            } else {
                setOrder(dataRecv.data);
            }
        } catch (error) {
            setOrder(null);
        } finally {

        }
    }

    const formatDate = (date) => {
        // Parse the date string into a Date object
        const newDate = new Date(date);
        // Define the offset for the target timezone (+05:30)
        const targetOffset = 5.5 * 60; // 5.5 hours in minutes
        // Get the current offset of the local system timezone
        const localOffset = newDate.getTimezoneOffset(); // in minutes
        // Calculate the total offset to apply
        const totalOffset = targetOffset + localOffset;
        // Apply the offset to the date
        newDate.setMinutes(newDate.getMinutes() + totalOffset);
        // Format the date to the desired string representation
        const pad = (num) => String(num).padStart(2, '0');
        const formattedDate = `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}, ${pad(newDate.getHours())}:${pad(newDate.getMinutes())}:${pad(newDate.getSeconds())}.${String(newDate.getMilliseconds()).padStart(3, '0')}+05:30`;
        return formattedDate; // "2024-06-16, 17:49:46.255+05:30"
    }

    useEffect(() => {
        // console.log(booking);
        //Fetch Event Info
        fetchEventData(booking.eventId)
        fetchOrder(booking.orderId)
        const selectedTickets = booking.ticketDetails.map(ticketItem => `${ticketItem.ticketType} (x${ticketItem.quantity})`);
        setTickets(selectedTickets)
    }, []);

    useEffect(() => {
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

    if (!event || !order)
        return

    return (
        <div className=' md:w-[60svw] mx-auto mt-10 relative overflow-hidden'>
            <div className='border border-[#E3E4E1] flex flex-row justify-between items-center '>
                <div className='p-5 px-10 pr-2 md:px-20'>
                    <p className="my-1 text-[0.8rem] text-[#00FF38]">{formattedDate}, {event.time}</p>
                    <h1 className='text-xl font-normal'>{event.title}</h1>
                    <p className='text-4xl font-medium font-mono mt-4'><span className='font-sans'>₹</span>{order.amount}</p>
                    <p className='text-[#757575] font-light text-xs'>{formatDate(order.createdAt)}</p>
                    <p className='text-[#757575] font-light mb-4 text-[0.55rem]'>#{booking.ticketId}</p>
                </div>
                <div className='w-[40%] h-[40%] mr-[50px] text-center py-5'>
                    {booking.qrLink && <Image
                        src={booking.qrLink}
                        height={150}
                        width={150}
                        className="rounded-lg mx-auto"
                        alt='QR Code'
                    />}
                    <p className='font-light mt-5'>{tickets}</p>
                </div>

                <div className='bg-black rounded-full w-[50px] h-[50px] border absolute -right-[25px]'></div>
                <div className='bg-black rounded-full w-[50px] h-[50px] border absolute -left-[25px]'></div>
            </div>
            <hr className='opacity-35' />
        </div>
    )
}

export default TicketItem