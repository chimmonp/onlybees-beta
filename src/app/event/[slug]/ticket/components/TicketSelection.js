import React from 'react'


//Accordion
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';

//MUI Icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Image from 'next/image';

const TicketSelection = ({ event, tickets, handleIncrement, handleDecrement }) => {

    //To get formatted date
    const options = {
        weekday: 'short', // Fri
        year: 'numeric',
        month: 'short', // May
        day: '2-digit', // 31
    };
    const date2 = new Date(event.date);
    const formattedDate = date2.toLocaleString('en-US', options);


    
    return (
        <div className='pt-10 pb-40 flex flex-col items-center justify-center'>
            <div className='md:w-[60vw] w-[82vw]'>
                <h1 className='text-[#00FF38] font-semibold text-4xl md:text-left'>TICKETS</h1>
                <div className='flex flex-row gap-5 mt-10 mb-10'>
                    <div className="flyer max-w-[150px] aspect-w-1 aspect-h-1">
                        <Image
                            src={event.imageUrl}
                            loading='lazy'
                            width={200}
                            height={200}
                            alt="Event Flyer"
                        />
                    </div>
                    <div className="p-0 flex flex-col justify-between h-[120px]">
                        <p className="lg:mt-3 text-2xl font-bold mb-1">{event.title}</p>
                        <p className="text-sm font-light mb-1">{event.venue}</p>
                        <p className="text-sm text-[#00FF38] mb-1">{formattedDate}</p>
                        <p className="text-sm">{event.city}</p>
                    </div>
                </div>
                {/* <h1 className='text-[#00FF38] font-bold text-2xl mt-16'>TICKETS</h1> */}
                <div className='h-fit mt-5 bg-[#121212] text-white p-3 rounded-lg'>
                    <Accordion preExpanded={[0]}>
                        {tickets.map((ticket, index) => (
                            <AccordionItem key={index} className=" border-gray-200" uuid={index}>
                                <AccordionItemHeading className=''>
                                    <AccordionItemButton className={`flex justify-between items-center p-4 cursor-pointer ${ticket.quantity!==0 ? "" : "opacity-50" } bg-[#121212]`}>
                                        <div className="flex items-center">
                                            <div className="mr-4">
                                                {/* <LocalActivityIcon /> */}
                                                {/* <ArrowDropDownIcon /> */}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium">{ticket.phaseName}</h3>
                                                <p className="text-[0.6rem] font-light">Pass for {formattedDate}</p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-medium">
                                            <div className='text-right'>₹{ticket.price}</div>
                                            {ticket.quantity===0 && <p className=' text-red-600 text-sm'>Sold Out!</p>}
                                        </div>
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                { ticket.quantity!==0 && <AccordionItemPanel className="">
                                        <p className="mx-8 mb-5 text-[0.8rem] font-normal">{` ${(ticket.coverCharge && ticket.coverCharge !== 0) ? `Cover : ${ticket.coverCharge}` : "No Cover"} ${(ticket.info!==null && ticket.info!=='')? ` | ${ticket.info}` : ""}`}</p>
                                        {/* { && <p className="ml-5 mb-10 text-[1rem] font-normal">{ticket.info}</p>} */}
                                    <div className='p-4 mx-4 border bg-[#121212] border-white border-opacity-20 rounded-[15px]'>
                                        <div className="flex justify-center items-center">
                                            <div className="flex gap-5 items-center">
                                                <button
                                                    onClick={() => handleDecrement(ticket.phaseName)}
                                                    className=""
                                                >
                                                    <span className='text-[2rem] font-light h-fit'>-</span>
                                                </button>
                                                <span className="mx-2 text-3xl">{ticket.selected}</span>
                                                <button
                                                    onClick={() => handleIncrement(ticket.phaseName)}
                                                    className=""
                                                >
                                                    <span className='text-[2rem] font-light h-fit'>+</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionItemPanel>}
                                {/* <hr /> */}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

export default TicketSelection