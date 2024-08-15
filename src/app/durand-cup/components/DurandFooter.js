import Link from 'next/link'
import React from 'react'

const DurandFooter = () => {
  return (
    <div className='w-screen bg-black py-4'>
        <p className='text-white text-center font-light'>Engineered by <Link href='https://chimmon.com' className='font-semibold'>Chimmon</Link> &amp; <Link href='https://gauravjoshi.site' className='font-semibold'>Gaurav</Link> of <span className='font-coolvetica'>ONLYBEES.</span></p>
    </div>
  )
}

export default DurandFooter