import Image from 'next/image'
import Link from 'next/link'

//Assets
import ticket from "../../../../public/Ticket.svg"


const EventItem = (props) => {

    const options = {
        weekday: 'short', // Fri
        month: 'short', // May
        day: '2-digit', // 31
    };
    const date = new Date(props.eventItem.date);
    const formattedDate = date.toLocaleString('en-US', options);

    //Get lowest of all ticket prices
    const getStartingPrice = () => {
        const prices = Object.values(props.eventItem.ticketPrice).map(phase => phase.price);
        const minPrice = Math.min(...prices);
        return minPrice === 0 ? 'Free Onwards' : `From ₹${minPrice}`;
    };

    if(props.eventItem.slug === 'summer-fest-25'){
        return;
    }

    return (
        <Link
            href={`/event/${props.eventItem.slug}`}
            passHref
        >
            <div className='w-auto h-auto px-0 mb-2'>
                <Image
                    src={(props.eventItem.imageUrl !== null) ? props.eventItem.imageUrl : ""}
                    loading="lazy"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="h-full w-full aspect-square object-cover"
                    alt="Event Flyer"
                    style={{ "boxShadow": "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", "borderRadius": "8px" }}
                />
                <div className='flex flex-row'>
                    <div className='lg:w-[93%] w-[90%] pr-2'>
                        <div className=' text-left mt-3 font-semibold font-blogger text-xl lg:text-2xl leading-6'>{props.eventItem.title}</div>
                        <div className=' text-left font-semibold text-[#00FF38] text-xs lg:text-sm lg:leading-normal mt-1'>{formattedDate}</div>
                        <div className=' mt-[0.2rem] text-left font-medium text-xs lg:text-sm lg:leading-normal'>{`${props.eventItem.venue}, ${props.eventItem.city}`}</div>
                        <div className=' mt-[0.2rem] text-left font-medium text-[#afafaf] text-xs lg:text-sm lg:leading-normal '>{getStartingPrice()}</div>
                    </div>
                    <div className='lg:w-[7%] w-[10%]'>
                        <Image
                            src={ticket}
                            loading="lazy"
                            width="0"
                            height="0"
                            sizes="100vw"
                            className=" lg:mt-[1.125rem] mt-[1.13rem] w-full object-cover"
                            alt="Event Flyer"
                        />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default EventItem;
