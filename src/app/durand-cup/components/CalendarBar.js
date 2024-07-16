import Link from 'next/link'
import React from 'react'

import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';

import { usePathname } from 'next/navigation';

const CalendarBar = () => {

    const pathname = usePathname().split('/').pop();

    return (
        <div>
            <div className='lg:flex hidden h-full flex-col lg:w-[10svw] bg-black pl-5 gap-10 text-white py-5'>
                <h2>MORE DATES</h2>
                <Link href="/durand-cup/tickets/aug-02">
                    <div className={`${pathname==='aug-02'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-5 px-2 rounded-l-lg font-semibold text-center hover:scale-y-125 transition-transform duration-200`}>AUGUST 02</div>
                </Link>
                <Link href="/durand-cup/tickets/aug-05">
                    <div className={`${pathname==='aug-05'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-5 px-2 rounded-l-lg font-semibold text-center hover:scale-y-125 transition-transform duration-200`}>AUGUST 05</div>
                </Link>
                <Link href="/durand-cup/tickets/aug-08">
                    <div className={`${pathname==='aug-08'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-5 px-2 rounded-l-lg font-semibold text-center hover:scale-y-125 transition-transform duration-200`}>AUGUST 08</div>
                </Link>
                <Link href="/durand-cup/tickets/aug-10">
                    <div className={`${pathname==='aug-10'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-5 px-2 rounded-l-lg font-semibold text-center hover:scale-y-125 transition-transform duration-200`}>AUGUST 10</div>
                </Link>
                <Link href="/durand-cup/tickets/aug-13">
                    <div className={`${pathname==='aug-13'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-5 px-2 rounded-l-lg font-semibold text-center hover:scale-y-125 transition-transform duration-200`}>AUGUST 13</div>
                </Link>
                <Link href="/durand-cup/tickets/aug-17">
                    <div className={`${pathname==='aug-17'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-5 px-2 rounded-l-lg font-semibold text-center hover:scale-y-125 transition-transform duration-200`}>AUGUST 17</div>
                </Link>
            </div>
            <div className='lg:hidden w-[100svw] bg-black px-5 gap-10 text-white pt-5'>
                <div className='flex flex-row justify-between pr-5 pb-2'>
                    <h2 className='mb-2'>MORE DATES</h2>
                    <SwipeLeftIcon />
                </div>
                <div className='flex flex-row gap-5 overflow-x-scroll scroll'>
                    <Link href="/durand-cup/tickets/aug-02">
                        <div className={`${pathname==='aug-02'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-2 px-2 rounded-t-lg font-semibold text-center`}>AUG 02</div>
                    </Link>
                    <Link href="/durand-cup/tickets/aug-05">
                        <div className={`${pathname==='aug-05'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-2 px-2 rounded-t-lg font-semibold text-center`}>AUG 05</div>
                    </Link>
                    <Link href="/durand-cup/tickets/aug-08">
                        <div className={`${pathname==='aug-08'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-2 px-2 rounded-t-lg font-semibold text-center`}>AUG 08</div>
                    </Link>
                    <Link href="/durand-cup/tickets/aug-10">
                        <div className={`${pathname==='aug-10'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-2 px-2 rounded-t-lg font-semibold text-center`}>AUG 10</div>
                    </Link>
                    <Link href="/durand-cup/tickets/aug-13">
                        <div className={`${pathname==='aug-13'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-2 px-2 rounded-t-lg font-semibold text-center`}>AUG 13</div>
                    </Link>
                    <Link href="/durand-cup/tickets/aug-17">
                        <div className={`${pathname==='aug-17'? "bg-[#D9D9D9] text-black": "bg-[#333333]"} py-2 px-2 rounded-t-lg font-semibold text-center`}>AUG 17</div>
                    </Link>
                </div>
            </div>
            
        </div>
    )
}

export default CalendarBar