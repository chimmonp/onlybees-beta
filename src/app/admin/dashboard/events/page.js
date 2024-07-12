"use client"
import React, { useEffect, useState } from 'react'
import Loading from '@/app/components/Loading';
import EventCard from "../../components/EventCard"
import Link from 'next/link';

const Card = (props) => {
    return (
        <Link href={`/admin/dashboard/${props.link}`} className='cursor-pointer w-full'>
            <div className='md:text-center border hover:border-[#00FF38] border-1 hover:bg-[#00FF38] hover:text-black px-5 py-5'>
                <h1 className='text-2xl'>{`${props.title} event`}</h1>
            </div>
        </Link>
    );
}

const Events = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/events/fetchevents');
            const result = await response.json();
            if (result.success) {
                const upcomingEvents = result.upcomingEvents
                const pastEvents = result.pastEvents
                setEvents([...upcomingEvents, ...pastEvents]);
                setLoading(false);
            } else {
                console.error('Error fetching events:', result.error);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    if (loading) return <Loading></Loading>;

    return (
        <div className="md:px-16 py-5 text-center">
            <div className='px-5 pt-5 flex flex-col md:flex-row justify-between md:gap-10 gap-5'>
                <Card title="Add" link="add-event"/>
                <Card title="Edit" link="edit-event"/>
                <Card title="Delete" link="delete-event"/>
            </div>
            <h2 className='mt-20 text-xl'>All events</h2>
            <div className="events grid w-full mt-5 px-10" style={{ scrollbarWidth: 'none' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mx-auto">
                        {events.map((event, index) => (
                            <div key={index} className="">
                                <EventCard
                                    key={index}
                                    eventItem={event}
                                    edit={false}
                                    delete={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    )
}

export default Events