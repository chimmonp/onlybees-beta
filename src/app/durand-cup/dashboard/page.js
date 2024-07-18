'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link';


//Components
import Loading from '@/app/components/Loading';


//MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


//Context
import { useOrganizer } from '@/context/OrganizerContext';


const Organizer = ({ }) => {

    const [loading, setLoading] = useState(false)
    const [matches, setMatches] = useState([])
    // const [searchEntry, setSearchEntry] = useState([])
    // const [filteredEvents, setFilteredEvents] = useState([]);
    const { organizer } = useOrganizer(null);
    const [organizerData, setOrganizerData] = useState([])


    const fetchAllMatches = async () => {
        try {
            const response = await fetch(`/api/durand-cup/allmatches`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setMatches(data.matches);
        } catch (error) {
            console.error('Error fetching all Sections:', error);
        }
    };

    useEffect(() => {
        fetchAllMatches();
    }, []);

    if (loading)
        return <Loading />

    if (matches.length !== 0) {
        return (
            <div className='px-10 pb-10 md:w-[80svw] w-screen'>
                <h1 className='font-coolvetica text-2xl'>DASHBOARD</h1>
                <p className='text-3xl'>Durand Cup 2024</p>
                <p className=' mt-10 mb-2 md:hidden text-sm'>scroll right <ArrowRightIcon /></p>
                <div className='md:mt-10 overflow-x-scroll'>
                    <table className='min-w-full'>
                        <thead className=''>
                            <tr className='text-center bg-[#555555] rounded-md'>
                                <th className='px-5 py-3 font-medium text-sm uppercase text-left'>Match</th>
                                <th className='px-3 py-3 font-medium text-sm uppercase'>Total Tickets</th>
                                <th className='px-3 py-3 font-medium text-sm uppercase'>Total Sales</th>
                                <th className='px-3 py-3 font-medium text-sm'></th>
                            </tr>
                        </thead>
                        <tbody className='bg-[#D9D9D9] text-black text-sm'>
                            <tr key={matches[0]._id} className=' text-center'>
                                <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{matches[0].teamA} vs. {matches[0].teamB}<br /><span className='font-normal text-[#555555] text-xs'>{matches[0].date}</span></td>
                                <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{matches[0].sold}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                <td className='py-7 text-xl font-semibold px-3 leading-none'>{matches[0].totalSales}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                <td className='py-7 min-w-fit text-right px-5'><Link href={`/durand-cup/dashboard/match/aug-02`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                            </tr>
                            <tr key={matches[1]._id} className=' text-center'>
                                <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{matches[1].teamA} vs. {matches[1].teamB}<br /><span className='font-normal text-[#555555] text-xs'>{matches[1].date}</span></td>
                                <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{matches[1].sold}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                <td className='py-7 text-xl font-semibold px-3 leading-none'>{matches[1].totalSales}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                <td className='py-7 min-w-fit text-right px-5'><Link href={`/durand-cup/dashboard/match/aug-05`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                            </tr>
                            <tr key={matches[2]._id} className=' text-center'>
                                <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{matches[2].teamA} vs. {matches[2].teamB}<br /><span className='font-normal text-[#555555] text-xs'>{matches[2].date}</span></td>
                                <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{matches[2].sold}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                <td className='py-7 text-xl font-semibold px-3 leading-none'>{matches[2].totalSales}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                <td className='py-7 min-w-fit text-right px-5'><Link href={`/durand-cup/dashboard/match/aug-08`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                            </tr>
                            <tr key={matches[3]._id} className=' text-center'>
                                <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{matches[3].teamA} vs. {matches[3].teamB}<br /><span className='font-normal text-[#555555] text-xs'>{matches[3].date}</span></td>
                                <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{matches[3].sold}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                <td className='py-7 text-xl font-semibold px-3 leading-none'>{matches[3].totalSales}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                <td className='py-7 min-w-fit text-right px-5'><Link href={`/durand-cup/dashboard/match/aug-10`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                            </tr>
                            <tr key={matches[4]._id} className=' text-center'>
                                <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{matches[4].teamA} vs. {matches[4].teamB}<br /><span className='font-normal text-[#555555] text-xs'>{matches[4].date}</span></td>
                                <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{matches[4].sold}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                <td className='py-7 text-xl font-semibold px-3 leading-none'>{matches[4].totalSales}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                <td className='py-7 min-w-fit text-right px-5'><Link href={`/durand-cup/dashboard/match/aug-13`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                            </tr>
                            <tr key={matches[5]._id} className=' text-center'>
                                <td className='py-7 text-left text-xl font-semibold px-5 leading-none'>{matches[5].teamA} vs. {matches[5].teamB}<br /><span className='font-normal text-[#555555] text-xs'>{matches[5].date}</span></td>
                                <td className='py-7 text-xl font-semibold px-2 text-wrap leading-none'>{matches[5].sold}<br /><span className='font-normal text-[#555555] text-xs'>Tickets</span></td>
                                <td className='py-7 text-xl font-semibold px-3 leading-none'>{matches[5].totalSales}<br /><span className='font-normal text-[#555555] text-xs'>Total Sales</span></td>
                                <td className='py-7 min-w-fit text-right px-5'><Link href={`/durand-cup/dashboard/match/aug-17`}><span className='bg-black text-white px-4 py-2 rounded-md text-xs text-nowrap'>VIEW DETAILS</span></Link></td>
                            </tr>

                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
}

export default Organizer