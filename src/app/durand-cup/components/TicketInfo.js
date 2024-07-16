"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import Razorpay from 'razorpay';

import loadRazorpay from '@/lib/loadRazorpay';

import { generateReceiptId } from "@/lib/uniqueReceipt"

import { useDurand } from "@/context/DurandContext"


const TicketInfo = ({ tickets, setTickets, sectionData, matchDetails }) => {

    const [totalAmt, setTotalAmt] = useState(0);
    const [convFee, setConvFee] = useState(0);
    const [platformFee, setPlatformFee] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [ticketDet, setTicketDet] = useState(0);
    const [orderDet, setOrderDet] = useState(0);

    const { durandData, setData, appendData } = useDurand();
    // const [page, setPage] = useState("ticket");
    // const [form, setForm] = useState({
    //     firstname: null,
    //     lastname: null,
    //     email: null,
    // });


    

    // useEffect(() => {
    //     const subtotalAmt = tickets * sectionData.price;
    //     const convFeeAmt = Math.round(0.03 * subtotalAmt);
    //     const platformFeeAmt = Math.round(0.0236 * subtotalAmt);
    //     const totalAmtCalc = subtotalAmt + convFeeAmt + platformFeeAmt;

    //     setSubtotal(subtotalAmt);
    //     setConvFee(convFeeAmt);
    //     setPlatformFee(platformFeeAmt);
    //     setTotalAmt(totalAmtCalc);


    //     appendData({ subtotalAmt, convFeeAmt, platformFeeAmt, totalAmtCalc });

    // }, [tickets, sectionData])

    useEffect(() => {

        const subtotalAmt = tickets * sectionData.price;
        const convFeeAmt = Math.round(0.03 * subtotalAmt);
        const platformFeeAmt = Math.round(0.0236 * subtotalAmt);
        const totalAmtCalc = subtotalAmt + convFeeAmt + platformFeeAmt;

        setData({
            sectionData: sectionData,
            tickets: tickets,
            matchDetails: matchDetails,
            amount: {
                subtotalAmt,
                convFeeAmt,
                platformFeeAmt,
                totalAmtCalc
            }
        })
    }, [tickets, sectionData, matchDetails])

    // const handleCheckout = async () => {
    //     try {
    //         const receiptId = generateReceiptId();
    //         const ticketDetails = sectionData
    //         const userID = "11002120121"
    //         // const userID = (user.isRegistered) ? user.userData._id : "1000000001";
    //         // const notes = (user.isRegistered) ? "" : "New user";

    //         const response = await axios.post('/api/razorpay/order', {
    //             userId: userID, // Replace with actual user ID
    //             matchId: matchDetails._id, // Replace with actual event ID
    //             ticketDetails: ticketDetails,
    //             amount: totalAmt,
    //             currency: 'INR',
    //             receipt: receiptId, // Replace with actual receipt ID
    //             notes: { notes }, // Optional: Replace with any additional notes
    //         });

    //         const { order, ticket, orderDetails } = response.data;

    //         setTicketDet(ticket)
    //         setOrderDet(orderDetails)


    //         // const keyId = process.env.RAZORPAY_KEY_ID;
    //         // const keySecret = process.env.RAZORPAY_KEY_SECRET;

    //         const razorpay = new Razorpay({
    //             key_id: "rzp_live_CorORgDh6QAI98",
    //             key_secret: "w1TwzubfVSB93Q8TQIOWaceB",
    //         });

    //         // Open Razorpay checkout form
    //         const options = {
    //             key: razorpay.key_id,
    //             amount: order.amount * 100, // Amount in paise
    //             currency: order.currency,
    //             name: 'Onlybees',
    //             image: "https://shorturl.at/kPO66",
    //             description: `Entry tickets for ${matchDetails.teamA} vs. ${matchDetails.teamB}`,
    //             order_id: order.id,


    //             handler: async function (response) {
    //                 // alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
    //                 const paymentId = response.razorpay_payment_id;
    //                 // console.log(paymentId)
    //                 // if (user.userData) {
    //                 //     saveOrder(ticket, { ...orderDetails, paymentId });
    //                 // }
    //                 // else {
    //                 //     userExists().then((exists) => {
    //                 //         if (exists) {
    //                 //             saveOrder(ticket, { ...orderDetails, paymentId });
    //                 //         } else {
    //                 //             createNewUser().then((created) => {
    //                 //                 saveOrder(ticket, { ...orderDetails, paymentId });
    //                 //             })
    //                 //         }
    //                 //     });
    //                 // }
    //                 saveOrder(ticket, { ...orderDetails, paymentId });
    //                 setPage("success")
    //                 // router.push("/dashboard/my-tickets")
    //             },

    //             prefill: {
    //                 name: `${form.firstname} ${form.lastname}`,
    //                 email: form.email,
    //                 contact: ph,
    //             },
    //             theme: {
    //                 color: '#00FF38',
    //             },
    //         };

    //         if (typeof window !== 'undefined' && typeof window.Razorpay === 'function') {
    //             const rzp1 = new window.Razorpay(options);
    //             rzp1.open();
    //         } else {
    //             console.error('Razorpay library not available');
    //         }


    //     } catch (error) {
    //         console.error('Error initiating payment:', error);
    //         // Handle error, e.g., show error message to user
    //         setPage("failed")
    //     }
    // };

    return (
        <div className='lg:bg-white bg-[#D9D9D9] lg:w-[25svw] lg:py-10 text-center flex flex-col justify-between'>
            <div className='lg:pb-0 pb-56 lg:pt-0 pt-20 px-5'>
                <select name="tickets" id="tickets" value={tickets} onChange={(e) => setTickets(e.target.value)} className='lg:bg-[#D9D9D9] bg-white py-3 w-full rounded-md px-4'>
                    <option value={1}>1 TICKET</option>
                    <option value={2}>2 TICKETS</option>
                    <option value={3}>3 TICKETS</option>
                    <option value={4}>4 TICKETS</option>
                    <option value={5}>5 TICKETS</option>
                    <option value={6}>6 TICKETS</option>
                    <option value={7}>7 TICKETS</option>
                    <option value={8}>8 TICKETS</option>
                    <option value={9}>9 TICKETS</option>
                    <option value={10}>10 TICKETS</option>
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
            </div>
            <div className=' lg:py-0 py-3 lg:relative fixed bottom-0 lg:w-auto w-screen bg-white px-5'>
                <div className='bg-[#D9D9D9] py-4 rounded-md text-2xl font-semibold'>
                    <p>₹{(tickets === 0 || !sectionData.price) ? 0 : tickets * sectionData.price}</p>
                    <p className='text-xs'>QUANTITY: {tickets}</p>
                </div>
                {tickets > 0 && sectionData.price ? (
                    <Link href="/durand-cup/tickets/buy">
                        <div className='bg-[#00FF38] mt-3 py-5 rounded-md font-semibold'>BOOK NOW</div>
                    </Link>
                ) : (
                    <div className='bg-[#cccccc] opacity-40 mt-3 py-5 rounded-md font-semibold cursor-not-allowed'>BOOK NOW</div>
                )}
            </div>
        </div>
    )
}

export default TicketInfo