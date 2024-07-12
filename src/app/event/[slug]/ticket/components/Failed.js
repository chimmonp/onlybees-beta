// MUI Icons
import ClearIcon from '@mui/icons-material/Clear';


import Link from 'next/link';


const Failed = (props) => {


    return (
        <div className="h-[100svh] flex flex-col items-center justify-center text-black md:px-0 px-10 py-10">
            <div className="md:py-10 py-15 pt-10 md:pt-5 px-10 md:w-[30svw] w-full bg-white rounded-t-3xl relative text-center">
                <Link href="/events" className='w-fit rounded-full absolute right-[20px] top-[20px]'> <ClearIcon sx={{ "color": "#3A3A3A", "fontSize": "1.5rem", "fontWeight": "500" }} /> </Link>
                <div className="md:w-[6svw] md:h-[6svw] w-[80px] h-[80px] rounded-full bg-[#BD3A2E] absolute md:-top-[5svh] md:right-[12svw] -top-[40px] left-[calc(50%-40px)] flex items-center justify-center border-8 border-white"><ClearIcon sx={{ "color": "white", "fontSize": "3rem", "fontWeight": "500" }} /></div>
                <h1 className='mt-[3svw] text-3xl font-semibold'>Payment Error!</h1>
                <h2 className='mt-2 md:text-md text-[0.8rem]'>There was a problem processing your payment.</h2>
                <p className='text-[0.6rem] mt-5 text-center text-[#3A3A3A]'>Payment ID : #{props.orderDetails.orderId}</p>
            </div>
            <div className="md:w-[30svw] w-full bg-[#D9D9D9] rounded-b-3xl py-7 md:px-12 px-5 md:text-[0.8rem] text-[0.7rem] text-center md:leading-6">
                <Link href={`/event/${props.event.slug}`} className='bg-black text-white px-5 py-3 rounded-full'>Try Again</Link>
            </div>
        </div>
    );
}

export default Failed;