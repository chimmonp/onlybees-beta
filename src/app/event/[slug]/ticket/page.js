"use client"

import React, { useEffect } from 'react'

//Components
import TicketPage from './components/TicketPage'

//Comtext
import { useEvent } from '@/context/EventContext';
import Loading from '@/app/components/Loading';
import EventNotFound from '@/app/components/EventNotFound';
import { useRouter } from 'next/navigation';


const Ticket = ({ params }) => {

    const { slug } = params;
    const { eventData, fetchEventData, isLoading, error } = useEvent();
    const router = useRouter();

    useEffect(() => {

        if(slug==='blenders-pride-fashion')
            router.push('/rsvp/');

        if (!eventData) {
            fetchEventData(slug);
        }
    }, [slug, fetchEventData]);

    // console.log(slug);


    return (
        <div className="bg-black text-white">
            {error && <EventNotFound />}
            {isLoading && <Loading />}
            {!error && !isLoading && eventData && <TicketPage event={eventData} slug={slug} />}
        </div>
    )
}

export default Ticket