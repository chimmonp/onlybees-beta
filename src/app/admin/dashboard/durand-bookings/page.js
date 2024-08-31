"use client"

import React, { useEffect, useState } from 'react';

const DurandBookings = () => {
    const [searchQuery, setSearchQuery] = useState('91');
    const [user, setUser] = useState(null);

    const handleSearch = async () => {
        if (searchQuery.trim() === '') return;

        try {
            const response = await fetch(`/api/durand-cup/searchUser?phone=${searchQuery}`);
            const data = await response.json();

            if (data.success) {
                setUser(data.user);
            } else {
                setUser(null); // No user found
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <div className='w-screen flex flex-col justify-center items-center min-h-screen overflow-visible'>
            <div className='mb-10'>
                <input
                    type="text"
                    placeholder="Search by Phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='text-white bg-black border border-white py-2 px-5 w-[50%]'
                />
                <button onClick={handleSearch} className='text-black font-bold py-2 px-5 bg-[#00ff38]'>Search</button></div>


            {user && (
                <div className=''>
                    <h2 className='font-bold text-xl mb-5'>{user.firstname} {user.lastname}</h2>
                    {user.sportsBookings.length > 0 ? (
                        user.sportsBookings
                            .filter(booking => booking.match === '66c77679828a6281539e9e79')
                            .map((booking, index) => (
                                <div key={index} className='mb-5 py-2'>
                                    <hr />
                                    <p>Match ID: {booking.match}</p>
                                    <p>Order ID: {booking.orderId}</p>
                                    <p>Booking Date: {new Date(booking.bookingDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                                    <img src={booking.qrLink} alt="QR Code" className='w-[70%]' />
                                    <hr />
                                </div>
                            ))
                    ) : (
                        <p>No sports bookings found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DurandBookings;
