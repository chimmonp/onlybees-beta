import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import Link from 'next/link'

//Components


const TermsOfUse = () => {
    return (
        <div className='home-page bg-white text-black min-h-[100svh]'>
            <Navbar mode="light" />
            <div className='pt-10 pb-20 px-10 terms'>
                <h1 className='text-3xl font-coolvetica'>CANCELLATION AND REFUND POLICY</h1>
                <h2 className='text-xl mt-5 mb-2 font-medium'>1. Event Cancellation</h2>
                <p>If an event is canceled by the organizer or OnlyBees, customers will be eligible for a full refund. The refund process will be initiated automatically, and customers will be notified via email.</p>

                <h2 className='text-xl mt-5 mb-2 font-medium'>2. Customer-Initiated Cancellation</h2>
                <p>Customers may request a cancellation and refund up to 7 days before the event date for a full refund.</p>
                <p>Cancellations made less than 7 days before the event may be eligible for a partial refund at the discretion of Onlybees and the event organizer.</p>

                <h2 className='text-xl mt-5 mb-2 font-medium'>3. Process for Requesting a Refund:</h2>
                <p>To request a refund, customers must provide the following details:</p>
                <ul className='list-disc pl-4'>
                    <li>Event Name</li>
                    <li>Date of the Event</li>
                    <li>Booking Reference Number</li>
                    <li>Customer Name</li>
                    <li>Reason for Cancellation</li>
                </ul>
                <p>To request a refund, customers must provide the following details:</p>
                <p>Refund requests can be sent to <a href="mailto:info@onlybees.in" className='font-medium'>info@onlybees.in</a> or submitted through the Onlybees website.</p>
                
                <h2 className='text-xl mt-5 mb-2 font-medium'>4. Refund Timeline:</h2>
                <p>Refunds will be processed within 7-10 business days from the date of cancellation approval.</p>
                <p>The refund amount will be credited back to the original payment method used during the purchase.</p>

                <h2 className='text-xl mt-5 mb-2 font-medium'>5. Non-Refundable Scenarios:</h2>
                <p>No refunds will be issued for no-shows or late arrivals.</p>
                <p>Any service fees or charges associated with the ticket purchase are non-refundable.</p>

                <h2 className='text-xl mt-5 mb-2 font-medium'>6. Special Circumstances:</h2>
                <p>In cases of force majeure (e.g., natural disasters, pandemics), Onlybees will review refund requests on a case-by-case basis.</p>
                
                <h2 className='text-xl mt-5 mb-2 font-medium'>7. Contact Information:</h2>
                <p>For any queries or issues regarding cancellations and refunds, customers can contact Onlybees customer support at 8787740538 or email <a href="mailto:info@onlybees.in." className='font-medium'>info@onlybees.in</a>.</p>

            </div>
            <Footer mode="light" />
        </div>
    )
}

export default TermsOfUse