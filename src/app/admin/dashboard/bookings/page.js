import Link from 'next/link'
import React from 'react'

const Bookings = () => {
  return (
    <div className='p-10'>
      <Link href={`/admin/dashboard/scan-ticket`} className='cursor-pointer w-full'>
        <div className='md:text-center border hover:border-[#00FF38] border-1 hover:bg-[#00FF38] hover:text-black px-5 py-5'>
          <h1 className='text-2xl'>Scan Tickets</h1>
        </div>
      </Link>
    </div>
  )
}

export default Bookings