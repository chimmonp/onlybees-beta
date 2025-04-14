"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";



// Styles
import "./EventDetails.css";

//Context
import { useEvent } from "@/context/EventContext";

// Components
import Button from './Button';
import EventNotFound from './EventNotFound';

//MUI Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Loading from './Loading';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const EventDetails = (props) => {

    const { eventData, error, isLoading, fetchEventData } = useEvent();
    const [formattedDate, setFormattedDate] = useState(null)

    const router = useRouter();

    useEffect(() => {

        if(props.slug==='blenders-pride-fashion')
            router.push('/rsvp')

        fetchEventData(props.slug);

    }, [props.slug, fetchEventData]);

    useEffect(() => {
        if (eventData) {
            // To get formatted date
            const options = {
                weekday: 'short', // Fri
                year: 'numeric',
                month: 'short', // May
                day: '2-digit', // 31
            };
            const date2 = new Date(eventData.date);
            setFormattedDate(date2.toLocaleString('en-US', options));
        }
    }, [eventData]);

    // const { event } = props;

    const [windowWidth, setWindowWidth] = useState(null);
    const [isMobile, setIsMobile] = useState(false);




    // const router = useRouter();


    useEffect(() => {
        const updateWindowWidth = () => {
            setWindowWidth(window.innerWidth);
        };

        // Set initial value
        updateWindowWidth();

        // Add event listener for window resize
        window.addEventListener('resize', updateWindowWidth);

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', updateWindowWidth);
    }, []);
    useEffect(() => {
        // Decide which type of device
        const mobileBreakpoint = 768; // Example breakpoint for mobile devices
        if (windowWidth <= mobileBreakpoint) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, [windowWidth]);



    //Get lowest of all ticket prices
    const getStartingPrice = () => {
        // console.log(event, "\n");
        // console.log(eventData.ticketPrice);
        const prices = Object.values(eventData.ticketPrice).map(phase => phase.price);
        const minPrice = Math.min(...prices);
        return minPrice === 0 ? 'Free' : `₹${minPrice}`;
    };

    // Helper function to convert new lines to <br/>
    const formatAboutText = (text) => {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    if (error) {
        return <EventNotFound />
    }

    if (isLoading) {
        return (<div className='min-h-[100svh] min-w-[100svw]'><Loading /></div>)
    }


    return (
        <div className="event-container bg-black">
            <div className="my-16 flex lg:flex-row flex-col-reverse gap-6">

                {/* LEFT */}
                <div className="flex min-w-[50%] flex-col left gap-6">

                    <div className="p-0 leading-8">
                        <h2 className="lg:ml-0 ml-3 lg:text-right text-left text-5xl font-bold mb-2">{eventData.title}</h2>
                        <p className="lg:ml-0 ml-3 lg:text-right text-left font-light"><LocationOnIcon fontSize='small' /> {eventData.venue} <span className='text-[0.7rem]'></span></p>
                        {formattedDate && <h3 className="lg:ml-0 ml-3 lg:text-right text-left text-xl text-[#00FF38]">{formattedDate}, {eventData.time} <span className="font-light text-sm">{isMobile ? <br /> : ""}GMT +5:30</span></h3>}
                        <div className="lg:ml-0 ml-3 flex lg:gap-16 gap-10 lg:justify-end">
                            {/* <p>Tag</p> */}
                            <p>{eventData.city}</p>
                        </div>
                    </div>

                    <div className="scroll-about-text">
                        <h3 className="lg:text-right ml-2 text-xl font-bold leading-10">About</h3>
                        <div className="overflow-scroll about-text p-4 rounded-2xl min-w-full">
                            <p className="lg:text-right leading-7">{formatAboutText(eventData.about)}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col right gap-6">

                    <div className="flyer">
                        <Image
                            src={eventData.imageUrl}
                            priority
                            width={900}
                            height={900}
                            alt="Event Flyer"
                            className="aspect-square object-cover"
                        />
                    </div>

                    <div className="btn-container flex lg:flex-row flex-col p-7 lg:gap-10 gap-4 bg-[#1e1e1e] justify-center rounded-3xl">
                        <div className="leading-0 price">
                            <p className="font-semibold lg:text-[0.6rem] text-[0.8rem] lg:ml-0">STARTING</p>
                            <p className="font-semibold lg:text-4xl text-6xl">{getStartingPrice()}</p>
                        </div>
                        {props.slug!=='summer-fest-25' && <Button link={`/event/${props.slug}/ticket`} />}
                        {props.slug==='summer-fest-25' && <Button link={`https://in.bookmyshow.com/events/summer-fest-by-sunburn-shillong/ET00439860`} />}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default EventDetails
