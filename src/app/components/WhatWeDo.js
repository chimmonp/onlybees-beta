import Image from 'next/image'
import Link from 'next/link'


import React from 'react'


import whatwedo_1 from "../../../public/whatwedo_1.png"
import whatwedo_2 from "../../../public/whatwedo_2.png"
import whatwedo_3 from "../../../public/whatwedo_3.png"
import whatwedo_4 from "../../../public/whatwedo_4.png"


const WhatWeDo = () => {
    return (
        <div className='md:w-1/2 md:mx-auto mx-10 py-10'>
            <div className='flex md:flex-row flex-col-reverse md:items-end justify-center gap-3 relative'>
                <div className='md:text-right text-center min-w-fit'>
                    <h3 className='font-coolvetica text-3xl md:text-right text-center'>BECAUSE BEES CAN<br />DREAM TOO.</h3>
                    <h4 className='mt-5 md:text-right text-center font-medium'>Helping brands build their<br />digital identity</h4>
                    <h4 className='mt-5 md:text-right text-center font-medium'>Create and impactful<br />ecosystem of forward<br />thinkers</h4>
                    <Link href='/about' className='opacity-[63%]'><p className='mt-5 font-medium'>READ MORE</p></Link>
                </div>
                <div className='md:text-right text-center md:text-3xl text-2xl'>
                    <h2 className='font-coolvetica '>WHO ARE WE, WHAT WE DO</h2>
                    <Image
                        src={whatwedo_1}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className='rounded-2xl mt-2 h-full w-full object-cover'
                        alt='ODR Shillong Event'
                    />
                </div>
                <p className='absolute top-0 right-0 text-sm font-semibold transform translate-x-12 translate-y-16 -rotate-90'>EVENTS</p>
            </div>
            <div className='grid md:grid-cols-3 grid-cols-1 items-start gap-5 mt-5'>
                <div className='flex flex-col items-center justify-center'>
                    <Image
                        src={whatwedo_2}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className='rounded-2xl shadow-md mt-2 h-auto md:w-full w-[70vw] object-cover'
                        alt='PRODUCTION'
                    />
                    <div className='w-full md:text-left text-center'>
                        <h2 className='font-coolvetica min-w-[30svw] md:min-w-full text-3xl md:text-2xl mt-2 md:text-left pl-3 md:pr-0'>Mix'sis</h2>
                        <Link href='https://www.instagram.com/mixsis._/' target='_blank' rel='noreferrer noopener' className=' lowercase font-light min-w-[30svw] md:min-w-full text-sm md:text-sm md:text-left pl-3 md:pr-0'>VIEW MORE</Link>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <Image
                        src={whatwedo_3}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className='rounded-2xl mt-2 h-auto md:w-full w-[70vw] object-cover'
                        alt='ODR'
                    />
                    <div className='w-full md:text-left text-center'>
                        <h2 className='font-coolvetica min-w-[30svw] md:min-w-full text-3xl md:text-2xl mt-2 md:text-left pl-3 md:pr-0'>ODR</h2>
                        <Link href='https://onlydancinginthisroom.in/' target='_blank' rel='noreferrer noopener' className=' lowercase font-light min-w-[30svw] md:min-w-full text-sm md:text-sm md:text-left pl-3 md:pr-0'>VIEW MORE</Link>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <Image
                        src={whatwedo_4}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className='rounded-2xl mt-2 h-auto md:w-full w-[70vw] object-cover'
                        alt='B.A.D - VAASTA'
                    />
                    <div className='w-full md:text-left text-center'>
                        <h2 className='font-coolvetica min-w-[30svw] md:min-w-full text-3xl md:text-2xl mt-2 md:text-left pl-3 md:pr-0 leading-none'>ARTIST MANAGEMENT</h2>
                        <Link href='/artist' className='font-light min-w-[30svw] md:min-w-full text-sm md:text-sm lowercase  md:text-left pl-3 md:pr-0'>VIEW MORE</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhatWeDo