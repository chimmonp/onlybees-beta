// context/EventContext.js
"use client"

import React, { createContext, useState, useContext, useCallback } from 'react';

const EventContext = createContext();

export const useEvent = () => {
    return useContext(EventContext);
};

export const EventProvider = ({ children }) => {
    const [eventData, setEventData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEventData = useCallback(async (slug) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/events/eventinfo?slug=${slug}`);
            const dataRecv = await res.json();

            if (!dataRecv.success) {
                setError('Event not found');
                setEventData(null);
            } else {
                setEventData(dataRecv.data);
                setError(null);
            }
        } catch (error) {
            setError('Error fetching event data');
            setEventData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <EventContext.Provider value={{ eventData, error, isLoading, fetchEventData }}>
            {children}
        </EventContext.Provider>
    );
};
