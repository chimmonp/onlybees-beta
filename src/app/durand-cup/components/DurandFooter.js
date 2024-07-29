import Link from 'next/link'
import React from 'react'

const DurandFooter = () => {
  return (
    <div className='w-screen bg-black py-4'>
        <p className='text-white text-center font-light'>Developed and maintained by <Link href='https://chimmon.com' className='font-semibold'>Chimmon</Link> and <Link href='https://gauravjoshi.site' className='font-semibold'>Gaurav</Link> - <span className='font-coolvetica'>ONLYBEES.</span></p>
    </div>
  )
}

export default DurandFooter