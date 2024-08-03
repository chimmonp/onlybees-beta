import './Footer.css';
import Image from 'next/image';
import Link from 'next/link';

import dark from "../../../public/OnlyBees_dark.svg";
import light from "../../../public/OnlyBees_light.svg";
// social logos
import facebookDark from "../../../public/Facebook_black.svg"
import instagramDark from "../../../public/Instagram_black.svg"
import linkedInDark from "../../../public/LinkedIN_black.svg"
import WhatsAppDark from "../../../public/WhatsApp_black.svg"
import facebookLight from "../../../public/Facebook_white.svg"
import instagramLight from "../../../public/Instagram_white.svg"
import linkedInLight from "../../../public/LinkedIN_white.svg"
import WhatsAppLight from "../../../public/WhatsApp_white.svg"
// import whatsapp from "../../public/Whatsapp_black.svg"


const Footer = (props) => {
    return (
        <>
            <div className='mx-5 lg:mx-10 pb-5'>
                <div className={`border-b border-t ${props.mode == "dark" ? "border-white" : "border-black"} foot flex flex-col lg:flex-row lg:gap-40 lg:px-28`}>
                    <Image
                        src={(props.mode == "dark") ? light : dark}
                        width={500}
                        height="auto"
                        alt='OnlyBees logo'
                        className='lg:ml-28 foot-logo'
                    />
                    <div className={`footer-links flex flex-row lg:gap-40 gap-16 lg:mt-20 ${props.mode == "dark" ? "text-white" : "text-black"}`}>
                        <div className='Onlybees flex flex-col gap-5'>
                            <div className='font-semibold text-xl'>Onlybees.</div>
                            <Link className='text-xs font-medium' href="/about">About</Link>
                            <Link className='text-xs font-medium' href="/career">Career</Link>
                            <Link className='text-xs font-medium' href="/press">Press</Link>
                        </div>
                        <div className='Support flex flex-col gap-5'>
                            <div className='font-semibold text-xl'>Support</div>
                            <Link className='text-xs font-medium' href="/contact">Contact us</Link>
                            <Link className='text-xs font-medium' href="/refunds">Refund</Link>
                        </div>
                    </div>
                </div>
                <div className='copyright flex flex-col gap-5 lg:gap-0 lg:flex-row lg:justify-between py-3 text-center'>
                    <p className='text-sm'>Copyright &copy; Onlybees 2024, KL & Sons</p>
                    <div className='flex flex-col-reverse lg:flex-row lg:gap-16 gap-5'>
                        <div className='flex lg:gap-10 align-middle justify-center gap-10 px-5 lg:px-0'>
                            <Link className='text-xs font-medium pt-1' href="/privacy-policy">Privacy Policy</Link>
                            <Link className='text-xs font-medium pt-1' href="/terms-and-conditions">Terms and Conditions</Link>
                            <Link className='text-xs font-medium pt-1' href="/cookies">Cookies Settings</Link>
                        </div>
                        <div className='flex lg:justify-start justify-center lg:gap-4 gap-5'>
                            <Link href="https://www.onlybees.in/" rel="noopener noreferrer" target="_blank">
                                <Image
                                    src={(props.mode == "dark") ? facebookLight : facebookDark}
                                    width={25}
                                    height="auto"
                                    alt='social logo'
                                    className='socials'
                                />
                            </Link>
                            <Link href="https://www.instagram.com/onlybees.in/" rel="noopener noreferrer" target="_blank">
                                <Image
                                    src={(props.mode == "dark") ? instagramLight : instagramDark}
                                    width={25}
                                    height="auto"
                                    alt='social logo'
                                    className='socials'
                                />
                            </Link>
                            <Link href="https://www.linkedin.com/company/onlybees/" rel="noopener noreferrer" target="_blank">
                                <Image
                                    src={(props.mode == "dark") ? linkedInLight : linkedInDark}
                                    width={25}
                                    height="auto"
                                    alt='social logo'
                                    className='socials'
                                />
                            </Link>
                            <Link href="https://wa.me/918787740538" rel="noopener noreferrer" target="_blank">
                                <Image
                                    src={(props.mode == "dark") ? WhatsAppLight : WhatsAppDark}
                                    width={25}
                                    height="auto"
                                    alt='social logo'
                                    className='socials'
                                />
                            </Link>
                            {/* <Link href="https://wa.me/918787740538?text=Hi%20Onlybees!" rel="noopener noreferrer" target="_blank">
                            <Image 
                                src={whatsapp}
                                width={25}
                                height="auto"
                                alt='social logo'
                                className='socials'
                            />
                        </Link> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-screen bg-black py-4 lg:px-0 px-10 lg:text-base text-sm'>
                <p className='text-white text-center font-light'>Developed and maintained by <Link href='https://chimmon.com' className='font-semibold'>Chimmon</Link> &amp; <Link href='https://gauravjoshi.site' className='font-semibold'>Gaurav</Link> of <span className='font-coolvetica'>ONLYBEES.</span></p>
            </div>
        </>
    )
}

export default Footer