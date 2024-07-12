import Link from 'next/link'
import arrow from "../../../public/arrow.svg";
import Image from "next/image";
import "./Button.css"

const Button = (props) => {
    return (
        <Link
            href={props.link}
            // target="_blank"
            passHref
            className="lg:text-center text-left w-full"
        >
            <button role="button" className=" bg-[#00FF38] w-full hover:scale-105 text-black py-4 px-2 rounded-full btn-inner-container">
                <span className='font-semibold'>Book Now</span>
                <span className="arrow-container pb-1">
                    <Image priority src={arrow} alt="Arrow" />
                </span>
            </button>
            {/* <div className='bg-[#00FF38] pt-2 pb-0 px-2 rounded-full btn-inner-container'></div> */}
        </Link>
    )
}

export default Button