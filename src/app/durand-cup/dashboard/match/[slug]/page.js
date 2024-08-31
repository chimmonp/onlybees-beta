'use client'

import React, { useEffect, useState } from 'react'

//Components
import Loading from '@/app/components/Loading';

//MUI Icons
import SearchIcon from '@mui/icons-material/Search';

//Export CSV
import { CSVLink } from 'react-csv';

//Router
import { usePathname } from 'next/navigation';

//Context
import { useOrganizer } from '@/context/OrganizerContext';


const OrganizerEvent = () => {

    const [bookings, setBookings] = useState([]);
    const [displayedBookings, setDisplayedBookings] = useState([]);
    const [entries, setEntries] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalCheckIns, setTotalCheckIns] = useState(0);
    const [searchEntry, setSearchEntry] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [matchId, setMatchId] = useState(null);
    const [matchDetails, setMatchDetails] = useState([]);
    const [totalRedeemedQuantity, setTotalRedeemedQuantity] = useState([]);

    const {organizer} = useOrganizer()


    // Extract the ID after "event/"
    const pathname = usePathname().split('/').pop();

    const fetchBookings = async () => {
        if (!pathname) {
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`/api/durand-cup/orders?slug=${pathname}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log(data);
            setMatchDetails(data.match);

            // Filter bookings with status "SUCCESS" only
            const successfulBookings = data.orders.filter(order => order.status === "SUCCESS");
            // Sort bookings in descending order
            successfulBookings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            setBookings(successfulBookings);
            setTotalEntries(successfulBookings.length);
            setTotalRedeemedQuantity(data.totalUsedQuantity)
            // setTotalTickets(data.match.sold);
            // setTotalSales(data.match.totalSales);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const fetchSales = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/durand-cup/salesinfo?slug=${pathname}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            // console.log(data);
            // setMatchDetails(data.match);

            // Filter bookings with status "SUCCESS" only
            // const successfulBookings = data.orders.filter(order => order.status === "SUCCESS");
            // Sort bookings in descending order
            // successfulBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // setBookings(successfulBookings);
            // setTotalEntries(data.data.totalQuantity);
            setTotalTickets(data.data.totalQuantity);
            setTotalSales(data.data.totalBaseAmount);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        setMatchId(pathname);
        fetchBookings();
        fetchSales()
        // console.log(pathname);
    }, [pathname]);

    useEffect(() => {
        if (searchEntry.trim() === '') {
            updateDisplayedBookings(bookings);
        } else {
            handleSearch();
        }
    }, [bookings, currentPage, entries, searchEntry]);

    const updateDisplayedBookings = (filteredBookings) => {
        const startIndex = (currentPage - 1) * entries;
        const endIndex = startIndex + entries;
        const displayed = filteredBookings.slice(startIndex, endIndex);
        setDisplayedBookings(displayed);
    };

    const nextPage = () => {
        if (currentPage < Math.ceil(totalEntries / entries)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleEntriesChange = (e) => {
        const newEntries = parseInt(e.target.value, 10);
        setEntries(newEntries);
        setCurrentPage(1); // Reset to first page when changing entries per page
    };

    const handleSearchEntry = (e) => {
        setSearchEntry(e.target.value);
        if (e.target.value === '') {
            setFilteredBookings([]);
            updateDisplayedBookings(bookings);
        }
    };

    const handleSearch = () => {
        if (searchEntry.trim() !== '') {
            const searchTerm = searchEntry.toLowerCase().trim();
            const searchedBookings = bookings.filter((booking) => {
                return booking.name.toLowerCase().includes(searchTerm) ||
                    booking.email.toLowerCase().includes(searchTerm) ||
                    booking.phone.includes(searchTerm) ||
                    booking._id.toLowerCase().includes(searchTerm);
            });
            updateDisplayedBookings(searchedBookings);
        } else {
            updateDisplayedBookings(bookings);
        }
    };

    const totalPages = Math.ceil(totalEntries / entries);

    const csvHeaders = [
        { label: 'Name', key: 'name' },
        { label: 'Ticket Number', key: 'ticketNumber' },
        { label: 'Status', key: 'status' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Amount', key: 'amount' },
        { label: 'Booking Date', key: 'bookingDate' },
        { label: 'Total Quantity', key: 'totalQuantity' },
        { label: 'Bowl', key: 'bowl' },
        { label: 'Gate', key: 'gate' },
        { label: 'Entry', key: 'entry' },
        { label: 'Scanned', key: 'scanned' },
    ];

    const csvData = bookings.map((booking) => ({
        name: booking.name || 'undefined',
        ticketNumber: booking._id || 'undefined',
        status: booking.status || 'undefined',
        email: booking.email || 'undefined',
        phone: booking.phone || 'undefined',
        amount: booking.amount || 'undefined',
        bookingDate: new Date(booking.createdAt).toLocaleString() || 'undefined',
        totalQuantity: booking.quantity || 'undefined',
        bowl: booking.sectionInfo.bowl || 'undefined',
        gate: booking.sectionInfo.gate || 'undefined',
        entry: booking.sectionInfo.entry || 'undefined',
        scanned: booking.ticket[0].isUsed || 'false',
    }));

    if (loading)
        return <Loading />

    return (
        <div className='px-10 pb-10 md:w-[80svw] w-screen'>
            <h1 className='font-coolvetica text-2xl'>DASHBOARD</h1>
            <p className='text-3xl'>{matchDetails.teamA} vs. {matchDetails.teamB}</p>
            <p className='text-sm'>Match</p>
            {organizer && organizer.userId==='66991622612859bde39ee85c' && <div className='mt-10 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5'>
                <div className='flex flex-col items-center justify-center bg-[#D9D9D9] text-black h-full w-full py-10 md:px-5 px-1 rounded-lg'>
                    <p className='font-medium text-lg'>{totalSales}</p>
                    <p className='text-[#555555]'>Total Sales in INR</p>
                </div>
                <div className='flex flex-col items-center justify-center bg-[#D9D9D9] text-black h-full w-full py-10 px-5 rounded-lg'>
                    <p className='font-medium text-lg'>{totalTickets}</p>
                    <p className='text-[#555555]'>Total Tickets</p>
                </div>
                <div className='flex flex-col items-center justify-center bg-[#D9D9D9] text-black h-full w-full py-10 px-5 rounded-lg'>
                    <p className='font-medium text-lg'>{totalRedeemedQuantity}</p>
                    <p className='text-[#555555]'>Total Redeemed</p>
                </div>
            </div>}
            <div className='flex md:flex-row flex-col md:justify-between md:items-center justify-start items-start'>
                <select id="entries" className='bg-[#D9D9D9] w-[100px] mt-5 px-2 rounded-md py-1 text-black font-medium' value={entries} onChange={handleEntriesChange}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <div className='flex md:flex-row flex-col gap-5 mt-5'>
                    <CSVLink data={csvData} headers={csvHeaders} filename={`match_${pathname}_bookings.csv`} className="w-fit">
                        <p className='bg-[#00FF36] text-black px-7 py-1 rounded-md font-semibold'>Download CSV</p>
                    </CSVLink>
                    <div className='flex flex-row items-center gap-3'>
                        <input
                            type="search"
                            name="searchEntry"
                            id="searchEntry"
                            placeholder='Search '
                            value={searchEntry}
                            onChange={handleSearchEntry}
                            className='bg-black px-2  py-1 font-medium border-b border-white'
                        />
                        <SearchIcon className='cursor-pointer' onClick={handleSearch} />
                    </div>
                </div>
            </div>
            <p className='text-xs mt-1'>Show Entries</p>

            <div className='mt-10 overflow-x-scroll'>
                <table className='min-w-full'>
                    <thead className='bg-[#555555]'>
                        <tr className='text-left'>
                            <th className='px-3 py-3 font-medium text-sm'>Name</th>
                            <th className='px-3 py-3 font-medium text-sm'>Email</th>
                            <th className='px-3 py-3 font-medium text-sm'>Mobile</th>
                            <th className='px-3 py-3 font-medium text-sm'>Amount</th>
                            <th className='px-3 py-3 font-medium text-sm'>Date</th>
                            <th className='px-3 py-3 font-medium text-sm'>Tickets</th>
                            <th className='px-3 py-3 font-medium text-sm'>Bowl</th>
                            <th className='px-3 py-3 font-medium text-sm'>Gate</th>
                            <th className='px-3 py-3 font-medium text-sm'>T-ID</th>
                            {/* <th className='px-3 py-3 font-medium text-sm'>Payment Status</th> */}
                            <th className='px-3 py-3 font-medium text-sm'>Scanned</th>
                        </tr>
                    </thead>
                    <tbody className='bg-[#D9D9D9] text-black text-sm'>
                        {displayedBookings.map((booking, index) => {
                            let stat
                            if (booking.status === 'PAYMENT_PENDING')
                                stat = "PENDING"
                            else if (booking.status === 'PENDING')
                                stat = "PENDING"
                            else if (booking.status === 'SUCCESS')
                                stat = "SUCCESS"
                            else
                                stat = booking.status

                            return (
                                <tr key={booking._id} className='text-left border-b border-gray-400 border-opacity-25'>
                                    <td className='px-3'>{booking.name || 'undefined'}</td>
                                    <td className='px-3'>{booking.email || 'undefined'}</td>
                                    <td className='px-3'>{booking.phone || 'undefined'}</td>
                                    <td className='px-3'>{booking.amount}</td>
                                    <td className='px-3'>{new Date(booking.createdAt).toLocaleString()}</td>
                                    <td className='text-center px-3'>{booking.quantity}</td>
                                    <td className='px-3'>{booking.sectionInfo.bowl}</td>
                                    <td className='px-3'>{booking.sectionInfo.gate}</td>
                                    <td className='px-3 text-nowrap'>{booking.transactionId}</td>
                                    {/* <td className={`px-3 ${stat === "SUCCESS" ? "text-[#1baf39]" : "text-[#de0a26]"}`}>{stat}</td> */}
                                    <td className={`py-2 px-2 text-wrap font-mono text-center ${booking.ticket[0].isUsed?"text-[#1baf39]":"text-[#bd3a2e]"}`}>{booking.ticket[0].isUsed?"Yes":"No"}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='mt-5 flex gap-2'>
                <button className={`text-black py-1 px-4 rounded-sm ${(currentPage === 1) ? "bg-[#555555] opacity-80 cursor-not-allowed" : "bg-white"}`} onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <button className={`text-black py-1 px-4 rounded-sm ${(currentPage === totalPages) ? "bg-[#555555] opacity-80 cursor-not-allowed" : "bg-white"}`} onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    )
}

export default OrganizerEvent
