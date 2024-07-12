"use client"

import React, { useState, useEffect } from 'react'

//Components
import HomeEvent from '@/app/components/HomeEvent';



const SimilarEvents = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchEvents = async (city) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/events/fetchevents${city ? `?city=${city}` : ''}`);
            const result = await response.json();
            if (result.success) {
                let fetchedEvents = result.data
                fetchedEvents = fetchedEvents.slice(0, 6);
                setEvents(fetchedEvents);
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

    return (
        <div className="events flex gap-5 w-screen overflow-x-scroll overflow-y-clip" style={{ scrollbarWidth: 'none' }}>
          {events.map((event, index) => (
            <div key={index} className="py-3">
              <HomeEvent
                key={index}
                eventItem={event}
              />
            </div>
          ))}
        </div>
    )
}

export default SimilarEvents