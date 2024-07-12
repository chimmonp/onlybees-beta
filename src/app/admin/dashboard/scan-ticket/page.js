"use client"

import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';

const ScanTicket = () => {
    const [result, setResult] = useState(null);
    const [ticketDetails, setTicketDetails] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUsedModal, setShowUsedModal] = useState(false);

    // Function to fetch ticket details based on ticketId
    const fetchTicketDetails = (ticketId) => {
        fetch(`/api/tickets/get-details?ticketId=${ticketId}`)
            .then(response => response.json())
            .then(data => {
                setTicketDetails(data.ticket);
                setUserDetails(data.user);
                setEventDetails(data.event);
                if(ticketDetails.isUsed){

                }
                setShowModal(true); // Show modal once details are fetched
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleScan = (data) => {

        if (data) {
            setResult(data);
            fetchTicketDetails(data.text); // Fetch ticket details when QR code is scanned
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleConfirm = () => {
        // Mark ticket as used in the backend
        fetch('/api/tickets/scan-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId: ticketDetails._id }),
        })
            .then(response => response.json())
            .then(data => {
                setShowModal(false); // Close modal after confirming
                setResult(null)
                setTicketDetails(null)
                setUserDetails(null)
                setEventDetails(null)
            })
            .catch((error) => {
                console.error('Error marking ticket:', error);
            });
    };

    const handleCancel = () => {
        setShowModal(false); // Close modal on cancel
        setResult(null)
        setTicketDetails(null)
        setUserDetails(null)
        setEventDetails(null)
    };

    const previewStyle = {
        height: 320,
        width: 320,
        objectFit: "cover",
        outline: "2px solid #00FF38",
        outlineOffset: "-30px",
    };

    return (
        <div className='text-center h-screen flex flex-col justify-center items-center'>
            <div className=''>
                {!result && (
                    <QrScanner
                        delay={2000}
                        style={previewStyle}
                        onError={handleError}
                        onScan={handleScan}
                        legacyMode={true}
                        className="mx-auto w-full"
                    />
                )}
            </div>

            {showModal && ticketDetails && (
                <div className="modal bg-white text-black py-10 px-5 text-left">
                    <div className="modal-content">
                        <p className='mb-4'>Ticket successfully scanned!</p>
                        <h2 className='mb-4 text-xl font-extralight'>Ticket Details</h2>
                        <p className='mb-2'><b>Name:</b> {userDetails.firstname} {userDetails.lastname}</p>
                        <p className='mb-2'><b>Event:</b> {eventDetails.title}</p>
                        <p className='mb-2'><b>Quantity:</b> {ticketDetails.quantity}</p>
                        {/* Add more details as per your ticket schema */}

                        <div className="mt-10 modal-actions flex md:flex-row flex-col gap-3">
                            <button className='bg-black text-white py-2 px-5' onClick={handleConfirm}>Confirm</button>
                            <button className='border border-black py-2 px-5' onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScanTicket;
