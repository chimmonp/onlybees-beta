'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link';


//Components
import Loading from '../components/Loading';


//MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


//Context
import { useOrganizer } from '@/context/OrganizerContext';


const Organizer = ({ }) => {

    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])
    const [searchEntry, setSearchEntry] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([]);
    const { organizer } = useOrganizer(null);
    const [ organizerData, setOrganizerData ] = useState([])


    const fetchAllEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/organizer/allevents?organizerId=${organizer.userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log(data)
            setEvents(data.events)
            
            //Organizer Info
            const response2 = await fetch(`/api/organizer/getinfo?organizerId=${organizer.userId}`);
            if (!response2.ok) {
                throw new Error('Failed to fetch data');
            }
            const data2 = await response2.json();
            // console.log(data2)
            setOrganizerData(data2.organizer)

            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllEvents();
    }, []);

    // useEffect(() => {
    //     console.log(organizerData);
    // }, [organizerData]);


    // useEffect(() => {
    //     console.log(events);
    // }, [events]);

    const handleSearch = async (e) => {
        // Apply search filter if searchEntry is not empty
        if (searchEntry.trim() !== '') {
            const searchTerm = searchEntry.toLowerCase().trim();
            let searchedEvent = events.filter((event) => {
                return event.title.toLowerCase().includes(searchTerm)
            });
            setFilteredEvents(searchedEvent);
        }
    }

    const handleSearchEntry = (e) => {
        setSearchEntry(e.target.value)
        if (e.target.value === '') {
            setFilteredEvents([])
        }
    }


    if (loading)
        return <Loading />

    if (events.length !== 0) {
        return (
            <div className='px-10 pb-10 md:w-[80svw] w-screen'>
                <h1 className='font-coolvetica text-2xl'>DASHBOARD</h1>
                <p className='text-3xl'>{organizerData.name}</p>
                <div className='flex flex-row items-center gap-3 w-fit bg-[#D9D9D9] text-black px-2 my-4 rounded-md'>
                    <input
                        type="search"
                        name="searchEntry"
                        id="searchEntry"
                        placeholder='Search '
                        value={searchEntry}
                        onChange={handleSearchEntry}
                        className='px-2 bg-[#D9D9D9]  py-1 font-medium'
                    />
                    <SearchIcon className='cursor-pointer' onClick={handleSearch} />
                </div>
                <p className=' mt-10 mb-2 md:hidden text-sm'>scroll right <ArrowRightIcon /></p>
                <div className='md:mt-10 overflow-x-scroll'>
                    <table className='min-w-full'>
                        <thead className=''>
                            <tr className='text-center bg-[#555555] rounded-md'>
                                <th className='px-5 py-3 font-medium text-sm uppercase text-left'>Events</th>
                                <th className='px-3 py-3 font-medium text-sm uppercase'>Total Tickets</th>
                                <th className='px-3 py-3 font-medium text-sm uppercase'>Total Sales</th>
                                <th className='px-3 py-3 font-medium text-sm'></th>
                            </tr>
                        </thead>
                        <tbody className='bg-[#D9D9D9] text-black text-sm'>
                            {filteredEvents.length === 0 && events.map((event) => {
                                return (
                                    <tr key={event._id} className=' text-center'>
                                        <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{event.title || 'undefined'}<br /><span className='font-normal text-[#555555] text-xs'>{new Date(event.date).toLocaleDateString()}</span></td>
                                        <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{event.ticketsSold || 0}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                        <td className='py-7 text-xl font-semibold px-3 leading-none'>{event.totalSales || 0}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                        <td className='py-7 min-w-fit text-right px-5'><Link href={`/organizer/event/${event._id}`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                                    </tr>
                                )
                            }
                            )}
                            {filteredEvents.length !== 0 && filteredEvents.map((event) => {
                                return (
                                    <tr key={event._id} className=' text-center'>
                                        <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{event.title || 'undefined'}<br /><span className='font-normal text-[#555555] text-xs'>{new Date(event.date).toLocaleDateString()}</span></td>
                                        <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{event.ticketsSold || 0}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                        <td className='py-7 text-xl font-semibold px-3 leading-none'>{event.totalSales || 0}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                        <td className='py-7 min-w-fit text-right px-5'><Link href={`/organizer/event/${event._id}`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
}

export default Organizer