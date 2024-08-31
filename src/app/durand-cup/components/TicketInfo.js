"use client"

import Link from 'next/link'
import React, { useDebugValue, useEffect, useState } from 'react'

import { generateReceiptId } from "@/lib/uniqueReceipt"

import { useDurand } from "@/context/DurandContext"

import { usePathname } from "next/navigation"

import { v4 as uuidv4 } from 'uuid';

//Components
import Loading from '@/app/components/Loading'

import { useRouter } from 'next/navigation'






const TicketInfo = ({ tickets, setTickets, sectionData, matchDetails }) => {

    const router = useRouter()

    if (!sectionData) {
        return <div>Loading...</div>;
    }

    const { setData } = useDurand();
    const [avlQuantity, setAvlQuantity] = useState(0)

    const [isLoading, setIsLoading] = useState(false)

    const pathname = usePathname().split('/').pop();

    const [transactionId, setTransactionId] = useState()

    useEffect(() => {
        // Generate a transaction ID when the component mounts
        let transactionIdGen = "Tr-" + uuidv4().toString(36).slice(-6);
        setTransactionId(transactionIdGen)
    }, [])


    const getQuantityForDate = (date, availableQuantity) => {
        const match = availableQuantity.find(item => item.date === date);
        return match ? match.quantity - match.lockedSeats : 0;
    };


    useEffect(() => {

        const subtotalAmt = tickets * sectionData.price;
        const convFeeAmt = Math.round(0.03 * subtotalAmt);
        const platformFeeAmt = Math.round(0.0236 * subtotalAmt);
        const totalAmtCalc = subtotalAmt + convFeeAmt + platformFeeAmt;

        setData({
            sectionData: sectionData,
            tickets: tickets,
            matchDetails: matchDetails,
            transactionId: transactionId, // Add transactionId to the data
            amount: {
                subtotalAmt,
                convFeeAmt,
                platformFeeAmt,
                totalAmtCalc
            }
        })

        const availableTickets = getQuantityForDate(pathname, sectionData.availableQuantity || []);
        setAvlQuantity(availableTickets)

    }, [tickets, sectionData, matchDetails])


    // useEffect( () => {
    //     console.log(sectionData)
    // }, [ sectionData ] )

    const handleBuy = async () => {
        //Check if STILL AVAILABLE and proceed

        // const transactionId = "Tr-" + uuidv4().toString(36).slice(-6);
        setIsLoading(true)

        try {
            const response = await fetch('/api/durand-cup/check-and-lock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sectionId: sectionData._id,
                    date: pathname,  // Assuming pathname is the date
                    transactionId: transactionId, // Replace with the actual user ID
                    requestedSeats: tickets
                })
            });

            const data = await response.json();

            if (!data.success) {
                setIsLoading(false)
                alert(data.error);
                return;
            }
            setIsLoading(false)
            // Proceed to checkout
            router.push(`/durand-cup/tickets/buy`)
        } catch (error) {
            setIsLoading(false)
            console.error('Error checking and locking seats:', error);
            alert('An error occurred. Please try again.');
        }

    }


    return (
        <div className='lg:bg-white bg-[#D9D9D9] lg:w-[25svw] lg:py-10 text-center flex flex-col justify-between'>
            {isLoading && <Loading />}
            <div className='lg:pb-0 pb-56 lg:pt-0 pt-20 px-5'>
                <select name="tickets" id="tickets" value={tickets} onChange={(e) => setTickets(e.target.value)} className='lg:bg-[#D9D9D9] bg-white py-3 w-full rounded-md px-4'>
                    <option value={1}>1 TICKET</option>
                    {/* <option value={6}>6 TICKETS</option>
                    <option value={7}>7 TICKETS</option>
                    <option value={8}>8 TICKETS</option>
                    <option value={9}>9 TICKETS</option>
                    <option value={10}>10 TICKETS</option> */}
                </select>
                <select name="bowl" id="bowl" value={sectionData.bowl} disabled className='lg:bg-[#D9D9D9] bg-white mt-5 py-3 w-full rounded-md px-4'>
                    <option value="Upper Bowl">UPPER BOWL</option>
                    <option value="Lower Bowl">LOWER BOWL</option>
                </select>
                {sectionData.length !== 0 && <div className='bg-white mt-5 py-3 w-full rounded-md px-4'>
                    <h3>SECTION</h3>
                    <hr className='border-b border-opacity-10 border-black' />
                    <div className='flex flex-row justify-between px-5 py-3'>
                        <p>{sectionData._id.startsWith("lower") ? "Lower Bowl" : "Upper Bowl"}</p>
                        <p>{sectionData.gate}</p>
                    </div>
                </div>}
                <Link href="/durand-cup/terms-and-conditions/" target='_blank' rel='noopener noreferrer'>
                    <div className='text-black bg-[#D9D9D9] py-2 px-5 w-fit mt-5 rounded-lg cursor-pointer border border-black'>
                        <p className='text-xs'>Terms and conditions</p>
                    </div>
                </Link>
            </div>
            <div className=' lg:py-0 py-3 lg:relative fixed bottom-0 lg:w-auto w-screen bg-white px-5'>
                <div className='bg-[#D9D9D9] py-4 rounded-md text-2xl font-semibold'>
                    <p>₹{(tickets === 0 || !sectionData.price) ? 0 : tickets * sectionData.price}</p>
                    {(tickets <= avlQuantity) && <p className='text-xs'>QUANTITY: {tickets}</p>}
                    {(tickets > avlQuantity) && (tickets > 1) && <p className='text-xs text-[#bd3a2e]'>Unavailable</p>}
                </div>
                {tickets > 0 && sectionData.price && tickets <= avlQuantity ? (
                    <div onClick={handleBuy}>
                        <div className='bg-[#00FF38] mt-3 py-5 mb-5 rounded-md font-semibold'>BOOK NOW</div>
                    </div>
                ) : (
                    <div className='bg-[#cccccc] opacity-40 mt-3 py-5 mb-5 rounded-md font-semibold cursor-not-allowed'>BOOK NOW</div>
                )}
            </div>

        </div>
    )
}

export default TicketInfo