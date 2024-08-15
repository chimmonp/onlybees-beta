"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';



const SportsTicketItem = ({ booking }) => {
    const [match, setMatch] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [section, setSection] = useState(null);
    const [formattedDate, setFormattedDate] = useState(null);

    const fetchMatchData = async (matchId) => {
        try {
            const res = await fetch(`/api/durand-cup/getmatchdata?matchId=${matchId}`);
            const dataRecv = await res.json();
            if (dataRecv.success) {
                setMatch(dataRecv.data);
            }
        } catch (error) {
            console.error("Failed to fetch match data", error);
        }
    };

    const fetchTicketData = async (ticketId) => {
        try {
            const res = await fetch(`/api/durand-cup/getticketdata?ticketId=${ticketId}`);
            const dataRecv = await res.json();
            if (dataRecv.success) {
                setTicket(dataRecv.data);
            }
        } catch (error) {
            console.error("Failed to fetch ticket data", error);
        }
    };

    const fetchSectionData = async (sectionId) => {
        try {
            const res = await fetch(`/api/durand-cup/getsectiondata?sectionId=${sectionId}`);
            const dataRecv = await res.json();
            if (dataRecv.success) {
                setSection(dataRecv.data);
            }
        } catch (error) {
            console.error("Failed to fetch section data", error);
        }
    };

    const formatDate = (date) => {
        const newDate = new Date(date);
        const targetOffset = 5.5 * 60;
        const localOffset = newDate.getTimezoneOffset();
        const totalOffset = targetOffset + localOffset;
        newDate.setMinutes(newDate.getMinutes() + totalOffset);
        const pad = (num) => String(num).padStart(2, '0');
        return `${newDate.getFullYear()}-${pad(newDate.getMonth() + 1)}-${pad(newDate.getDate())}, ${pad(newDate.getHours())}:${pad(newDate.getMinutes())}:${pad(newDate.getSeconds())}.${String(newDate.getMilliseconds()).padStart(3, '0')}+05:30`;
    };

    useEffect(() => {
        fetchMatchData(booking.match);
        fetchTicketData(booking.ticket);
    }, [booking.match, booking.ticket]);

    useEffect(() => {
        if (ticket && ticket.section) {
            fetchSectionData(ticket.section);
        }
    }, [ticket]);

    useEffect(() => {
        if (match) {
            setFormattedDate(match.date);
        }
    }, [match]);

    // Handle cases where data is missing
    if (!match || !ticket || !section) {
        return null; // or return a fallback UI like a message indicating that data is not available
    }

    return (
        <div className='md:w-[60svw] mx-auto mt-10 relative overflow-hidden'>
            <div className='border border-[#E3E4E1] flex flex-col lg:flex-row-reverse justify-between items-center '>
                <div className='w-[80%] h-[80%] lg:mt-0 lg:w-[40%] lg:h-[40%] lg:mr-[50px] text-center py-5'>
                    {booking.qrLink && <Image
                        src={booking.qrLink}
                        height={200}
                        width={200}
                        className="rounded-lg mx-auto invert"
                        alt='QR Code'
                    />}
                    <p className='font-medium bg-white text-black w-fit px-10 rounded-full py-1 text-lg mt-2 mx-auto lg:mb-3'>Qty: {ticket.quantity}</p>
                </div>
                <div className='p-5 px-10 pr-2 md:px-20'>
                    <p className='text-white font-thin mb-4 text-[1rem]'>Section: <strong>{section.bowl} - {section.entry} - Gate: {section.gate}</strong></p>
                    <p className="my-1 text-[0.8rem] text-[#00FF38]">{formattedDate}, {match.time}</p>
                    <h1 className='text-xl font-normal'>{match.teamA} vs {match.teamB}</h1>
                    <p className='text-4xl font-medium font-mono mt-4'><span className='font-sans'>₹</span>{ticket.amount}</p>
                    <p className='text-[#757575] font-light mb-4 text-xs'>{formatDate(ticket.bookingDate)}</p>
                    
                </div>
                <div className='bg-black rounded-full w-[50px] h-[50px] border absolute -right-[25px] top-[calc(50%-25px)]'></div>
                <div className='bg-black rounded-full w-[50px] h-[50px] border absolute -left-[25px] top-[calc(50%-25px)]'></div>
            </div>
            <hr className='opacity-35' />
        </div>
    );
};

export default SportsTicketItem;
