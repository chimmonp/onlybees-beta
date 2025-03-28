"use client"

import React, { useState } from 'react';
// import QrScanner from 'react-qr-scanner';
import QrReader from 'modern-react-qr-reader'

// import { useOrganizer } from "@/context/OrganizerContext"



const NotAllowed = ({ matchDetails, handleCancel }) => {
    return (
        <div className="modal bg-white text-black py-10 px-5 text-left">
            <div className="modal-content">
                <p className='mb-4'>Not Allowed!</p>
                <h2 className='mb-4 text-xl font-extralight text-[#bd3a2e]'>Ticket for another Match.</h2>
                <p className='mb-2'><b>Match:</b> {matchDetails.teamA} vs. {matchDetails.teamB}</p>
                {/* Add more details as per your ticket schema */}
                <div className="mt-10 modal-actions flex md:flex-row flex-col gap-3">
                    <button className='border border-black py-2 px-5' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

const TicketUsed = ({ matchDetails, userDetails, handleCancel }) => {
    return (
        <div className="modal bg-white text-black py-10 px-5 text-left">
            <div className="modal-content">
                <p className='mb-4'>Not Allowed!</p>
                <h2 className='mb-4 text-xl font-extralight text-[#bd3a2e]'>Ticket Expired!</h2>
                <p className='mb-2'><b>Match:</b> {matchDetails.teamA || ''} vs. {matchDetails.teamB || ''}</p>
                <p className='mb-2'><b>Name:</b> {userDetails.firstname || ''} {userDetails.lastname}</p>
                {/* Add more details as per your ticket schema */}

                <div className="mt-10 modal-actions flex md:flex-row flex-col gap-3">
                    <button className='border border-black py-2 px-5' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}



const ScanTicket = () => {
    const [result, setResult] = useState(null);
    const [ticketInfo, setTicketInfo] = useState(null);
    const [sectionInfo, setSectionInfo] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [matchDetails, setMatchDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUsedModal, setShowUsedModal] = useState(false);
    const [showNotAllowedModal, setShowNotAllowedModal] = useState(false);

    // const { organizer } = useOrganizer();
    // console.log(organizer)

    // Function to fetch ticket details based on ticketId
    const fetchTicketDetails = (ticketId) => {
        fetch(`/api/durand-cup/tickets/get-details?ticketId=${ticketId}`)
            .then(response => response.json())
            .then(data => {

                setTicketInfo(data.ticket);
                setUserDetails(data.user);
                setMatchDetails(data.match);
                setSectionInfo(data.section)
                // console.log(data.ticket)

                // if (data.event.organizer === organizer.userId) {
                    if (data.ticket.isUsed) {
                        // console.log("used")
                        setShowUsedModal(true);
                        return;
                    }
                    else {
                        setShowModal(true);
                    }
                // }
                // else {
                //     console.log("Not allowed")
                //     setShowNotAllowedModal(true);
                //     return
                // }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleScan = (data) => {
        if (data) {
            console.log(data)
            setResult(data);
            fetchTicketDetails(data); // Fetch ticket details when QR code is scanned
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleConfirm = () => {
        // Mark ticket as used in the backend
        fetch('/api/durand-cup/tickets/scan-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId: ticketInfo._id }),
        })
            .then(response => response.json())
            .then(data => {
                setShowModal(false); // Close modal after confirming
                setResult(null)
                setTicketInfo(null)
                setUserDetails(null)
                setMatchDetails(null)
            })
            .catch((error) => {
                console.error('Error marking ticket:', error);
            });
    };

    const handleCancel = () => {
        setShowModal(false); // Close modal on cancel
        setShowNotAllowedModal(false); // Close modal on cancel
        setShowUsedModal(false)
        setResult(null)
        setTicketInfo(null)
        setUserDetails(null)
        setMatchDetails(null)
    };

    const previewStyle = {
        height: 320,
        width: 320,
        objectFit: "cover",
        outline: "2px solid #00FF38",
        outlineOffset: "-30px",
    };


    return (
        <div className='w-screen md:w-[80svw] text-center h-full flex flex-col justify-center items-center'>
            <div className=''>
                {!result && (
                    <div className='-mt-20 overflow'>
                        <p className='mb-10 font-coolvetica uppercase text-2xl'>SCAN TICKETS HERE</p>
                        <QrReader
                            delay={2000}
                            // style={previewStyle}
                            style={{ width: '100%' }}
                            onError={handleError}
                            onScan={handleScan}
                            legacymode="true"
                            facingMode={"environment"}
                            // constraints={{ facingMode: 'environment' }} // Set camera settings here
                            className="mx-auto w-full"
                        />
                        <p className='mt-5'>Place the QR code within the red area</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal bg-white text-black py-10 px-5 mx-10 text-left">
                    <div className="modal-content">
                        <p className='mb-4 text-[#21d746]'>Ticket successfully scanned!</p>
                        <h2 className='mb-4 text-xl font-extralight'>Ticket Details</h2>
                        <p className='mb-2 text-xl'><b>Quantity: {ticketInfo.quantity}</b></p>
                        <p className='mb-2 text-xl'><b>Gate: {sectionInfo.gate}</b></p>
                        <p className='mb-2 text-lg'>{sectionInfo._id}</p>
                        <br />
                        <p className='mb-2'><b>Entry:</b> {sectionInfo.entry}</p>
                        <p className='mb-2'><b>Name:</b> {userDetails.firstname} {userDetails.lastname}</p>
                        <p className='mb-2'><b>Match:</b> {matchDetails.teamA} vs. {matchDetails.teamB}</p>
                        <p className='mb-2'><b>Date:</b> {matchDetails.date}</p>
                        <p className='mb-2'><b>Amount:</b> {ticketInfo.amount}</p>
                        {/* Add more details as per your ticket schema */}

                        <div className="mt-10 modal-actions flex md:flex-row flex-col gap-3">
                            <button className='bg-black text-white py-2 px-5' onClick={handleConfirm}>Confirm</button>
                            <button className='border border-black py-2 px-5' onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showUsedModal && <TicketUsed matchDetails={matchDetails} userDetails={userDetails} handleCancel={handleCancel} />}

            {showNotAllowedModal && <NotAllowed matchDetails={matchDetails} handleCancel={handleCancel} />}

        </div>
    );
};

export default ScanTicket;
