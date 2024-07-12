import React from 'react'
import Image from 'next/image'

//Assets
import image from "../../../public/our-work.jpg"

const OurWorkSection = () => {
    return (
        <div className='md:w-1/2 md:mx-auto mx-10'>
            <h2 className='text-3xl font-medium mb-5 font-coolvetica uppercase'>Have a look at some of our work!</h2>
            <div className='relative flex flex-row items-end mb-2'>
                <Image
                    src={image}
                    priority
                    width={900}
                    height="auto"
                    alt="Event Flyer"
                    className='rounded-xl'
                />
                <p className='absolute bottom-0 right-0 text-sm font-semibold transform translate-x-14 -translate-y-8 -rotate-90'>Music Video</p>
            </div>
            <a href="https://youtube.com/playlist?list=PLU57vdzzIkqMkXuXE1iUGoUFqkX5cIqzm&si=0ApgGtvS2ngQFd9I" target="_blank" rel='noopener noreferrer' className='bg-black text-white mt-5 md:mt-0 px-4 py-1 text-xs rounded-full w-fit'>SEE MORE</a>
        </div>
    )
}

export default OurWorkSection