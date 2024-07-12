"use client"

// MUI Icons
import CheckIcon from '@mui/icons-material/Check';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ClearIcon from '@mui/icons-material/Clear';


import Link from 'next/link';


const Success = (props) => {


    const options = {
        weekday: 'short', // Fri
        month: 'short', // May
        day: '2-digit', // 31
    };
    const date2 = new Date(props.event.date);
    const formattedDate = date2.toLocaleString('en-US', options);

    const selectedTickets = props.ticket.ticketDetails.map(ticketItem => `${ticketItem.ticketType} (x${ticketItem.quantity})`);

    return (
        <div className="h-[100svh] flex flex-col items-center justify-center text-black md:px-0 px-10 py-10">
            <div className="md:py-5 py-15 pt-10 md:pt-5 px-10 md:w-[30svw] w-full bg-white rounded-t-3xl border-b-2 border-dashed relative text-center">
                <Link href="/events" className='w-fit rounded-full absolute right-[20px] top-[20px]'> <ClearIcon sx={{ "color": "#3A3A3A" ,"fontSize": "1.5rem", "fontWeight": "500" }}/> </Link>
                <div className="md:w-[6svw] md:h-[6svw] w-[80px] h-[80px] rounded-full bg-[#00FF38] absolute md:-top-[5svh] md:right-[12svw] -top-[40px] left-[calc(50%-40px)] flex items-center justify-center border-8 border-white"><CheckIcon sx={{ "color": "white", "fontSize": "3rem", "fontWeight": "500" }} /></div>
                <h1 className='mt-[3svw] text-3xl font-semibold'>Thank you!</h1>
                <h2 className='mt-2 md:text-md text-[0.8rem]'>Your payment was successful.</h2>
                <p className='text-xs mt-5'>A copy of the tickets has been emailed to you on</p>
                <p className='text-xs mb-7 font-semibold underline'>{props.form.email}</p>
                <div className='h-[50px] w-[50px] bg-black rounded-full absolute -left-[25px] -bottom-[25px]'></div>
                <div className='h-[50px] w-[50px] bg-black rounded-full absolute -right-[25px] -bottom-[25px]'></div>
            </div>
            <div className=" md:w-[30svw] w-full bg-white py-10 px-10">
                <p className='text-[0.6rem] text-center text-[#3A3A3A]'>Ticket ID : #{props.ticket._id}</p>
                <div className='flex items-center gap-2 mt-7'>
                    <LocationOnIcon sx={{ "fontSize": "2.5rem", "fontWeight": "500" }} />
                    <div className=''>
                        <p className='text-xs font-semibold text-[#3A3A3A]'>{formattedDate}, {props.event.time}</p>
                        <p className='font-bold text-lg -mt-1'>{props.event.venue}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2 mt-5'>
                    <LocalActivityIcon sx={{ "fontSize": "2.5rem", "fontWeight": "500" }} />
                    <div className=''>
                        <p className='text-xs font-semibold text-[#3A3A3A]'>{selectedTickets}</p>
                        <p className='font-bold text-lg -mt-1'>{props.event.title}</p>
                    </div>
                </div>
            </div>
            <div className="md:w-[30svw] w-full bg-[#D9D9D9] rounded-b-3xl py-7 md:px-12 px-5 md:text-[0.8rem] text-[0.7rem] text-center md:leading-6">
                You can <Link className='font-bold underline' href="/dashboard/my-tickets">view your tickets</Link> and <Link className='font-bold underline' href="/dashboard/orders">previous orders</Link> by loggin in using your phone number +{props.ph}
            </div>
        </div>
    );
}

export default Success;




