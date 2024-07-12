import React from 'react'
import Image from 'next/image'
import Link from 'next/link'


//Asserts
import illustration from "../../public/not-found-page.svg"
import logo from "../../public/OnlyBees_light.svg"
import arrow from "../../public/arrow.svg"


const NotFoundPage = () => {
  return (
    <div className='h-[100svh] bg-[#121212] flex flex-col gap-20 justify-center items-center'>
      <Image
        src={logo}
        priority
        width={300}
        height="auto"
        alt="Onlybees logo"
      />
      <div className='lg:w-[30svw] w-[80svw]'>
        <Image
          src={illustration}
          loading="lazy"
          width="0"
          height="0"
          sizes="100vw"
          className="h-full w-full object-cover"
          alt="Not found Illustration"
        />
      </div>
      <Link
        href="/events"
        passHref
        className="lg:text-center text-left"
      >
        <button role="button" className="flex flex-row gap-5 justify-center items-center bg-white lg:w-[15vw] w-[50vw] hover:scale-105 text-black py-3 px-2 rounded-full btn-inner-container">
          <span className='font-medium'>Browse events</span>
          <span className="arrow-container">
            <Image priority src={arrow} alt="Arrow" />
          </span>
        </button>
      </Link>
      <Link href="https://storyset.com/web" target='_blank' rel='noreferrer' className='fixed text-[12px] text-[#393939] no-underline right-5 bottom-5'>Illustration by Storyset</Link>
    </div>
  )
}

export default NotFoundPage