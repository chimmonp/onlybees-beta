"use client"
import React from 'react'
import Link from 'next/link';

const Card = (props) => {
    return (
        <Link href={`/admin/dashboard/${props.link}`} className='cursor-pointer w-full'>
            <div className='md:text-center border hover:border-[#00FF38] border-1 hover:bg-[#00FF38] hover:text-black px-5 py-5'>
                <h1 className='text-2xl'>{`${props.title} Organizer`}</h1>
            </div>
        </Link>
    );
}

const page = () => {
  return (
    <div className="md:px-16 py-5 text-center">
            <div className='px-5 pt-5 flex flex-col md:flex-row justify-between md:gap-10 gap-5'>
                <Card title="Add" link="organizers/add-organizer"/>
            </div>
        </div>
  )
}

export default page