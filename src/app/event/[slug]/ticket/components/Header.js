"use client";

import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import LogoutConfirmation from '@/app/components/LogoutConfirmation';

const Header = ({ mode, page, setPage, event}) => {


    const router = useRouter();
    const [ isOpen, setIsOpen ] = useState(false);
    

    const handleBack = () => {
        if (page === "details") {
            // const selectedTickets = tickets.filter(ticket => ticket.selected >= 1);
            // const baseAmount = selectedTickets.reduce((acc, ticket) => acc + ticket.price * ticket.selected, 0);
            // console.log(tickets)
            // console.log(baseAmount)
            // setTotalAmt(baseAmount);
            setPage("ticket")
        }
        else if (page === "details") {
            setPage("ticket")
        }
    }

    const handleClose = () => {
        setIsOpen(true);
        console.log(event);
    }

    const handleConfirm = () => {
        setIsOpen(false);
        const link = event.slug;
        router.push(`/event/${link}`)
    }



    return (
        <nav className={`${mode == "dark" ? "bg-black text-white border-white" : "bg-none border-black text-black"} nav border-b border-solid md:mx-10 py-5 mx-5 md:pr-2`}>
            <div className="flex flex-row justify-between items-center">
                {page !== "ticket" && <div className='text-black bg-white px-3 py-1 cursor-pointer rounded-full' onClick={handleBack}><KeyboardBackspaceIcon /> Back</div>}
                <div className='text-black bg-white px-1 py-1 cursor-pointer rounded-full' onClick={handleClose}><CloseIcon /></div>
            </div>
            {isOpen && <LogoutConfirmation title="Cancel Payment?" message="Payment will be cancelled and you'll be redirected to event page" handleConfirm={handleConfirm} handleCancel={()=>{setIsOpen(false)}}/>}
        </nav>
    )
}

export default Header