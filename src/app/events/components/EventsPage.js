"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'

//Components
import Loading from '@/app/components/Loading';
import EventItem from './EventItem';
import CityModal from './CityModal';

//MUI Icons
import FmdGoodIcon from '@mui/icons-material/FmdGood';

//Assets
import arrow from "../../../../public/arrow-right-stroke.svg"

const EventsPage = () => {

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);

    const fetchEvents = async (city) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/events/fetchevents${city ? `?city=${city}` : ''}`);
            const result = await response.json();
            if (result.success) {
                setUpcomingEvents(result.upcomingEvents);
                setPastEvents(result.pastEvents);
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

    const fetchCities = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/events/fetchcities`);
            const result = await response.json();
            if (result.success) {
                setCities(result.data);
                setLoading(false);
            } else {
                console.error('Error fetching cities:', result.error);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setUpcomingEvents([])
        fetchEvents(selectedCity);
    }, [selectedCity]);

    useEffect(() => {
        if (selectedCity) {
            fetchEvents(selectedCity);
        }
        else {
            const storedCity = localStorage.getItem('selectedCity');
            if (storedCity) {
                if (storedCity === 'null') {
                    fetchCities()
                    setIsModalOpen(true);
                }
                else {  
                    setSelectedCity(storedCity);
                    fetchEvents(storedCity);
                    fetchCities()
                }
            } else {
                fetchCities()
                setIsModalOpen(true);
            }
        }
    }, []);

    // useEffect(() => {

    // }, []);

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem('selectedCity', city);
        setIsModalOpen(false);
        // Track the selected city with Meta Pixel
        if (window.fbq) {
            window.fbq('trackCustom', 'CitySelected', { city });
        }
    };

    if (loading) return <Loading />


    return (
        <div className='text-white lg:py-20 lg:px-60 py-10 px-10 min-h-[70svh]'>
            <div className='flex gap-2 cursor-pointer mb-2' onClick={() => setIsModalOpen(true)}>
                <a className='font-medium lg:text-base text-sm'>Find your city</a>
                <Image
                    src={arrow}
                    height={15}
                    width="auto"
                    alt="Find your city"
                />
            </div>
            <div className='md:mb-20 mb-10 text-xs'><FmdGoodIcon sx={{ fontSize: "0.9rem", marginBottom: "2px" }} /> {selectedCity}</div>
            <div className="events grid w-full mt-5" style={{ scrollbarWidth: 'none' }}>
                {upcomingEvents.length === 0 && <div className='text-center w-full'>
                    <h2 className='mx-auto w-full text-sm px-10'>There are no upcoming events in this location :(</h2>
                </div>}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mx-auto">
                    {upcomingEvents.length !== 0 && upcomingEvents.map((event, index) => (
                        <div key={index} className="">
                            <EventItem
                                key={index}
                                eventItem={event}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {pastEvents.length !== 0 && <div className="events grid w-full mt-10" style={{ scrollbarWidth: 'none' }}>
                <h2 className='mb-5 text-2xl font-medium'>Past Events</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mx-auto">
                    {pastEvents.map((event, index) => (
                        <div key={index} className="">
                            <EventItem
                                key={index}
                                eventItem={event}
                            />
                        </div>
                    ))}
                </div>
            </div>}
            <CityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cities={cities}
                onSelectCity={handleSelectCity}
            />
        </div>
    )
}

export default EventsPage