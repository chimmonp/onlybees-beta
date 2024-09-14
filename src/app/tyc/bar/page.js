import React from 'react';
import Image from 'next/image';
import Barstage from '../components/navbar';
import Ihmage from '../components/image';
import Footer from '../components/footer';

const page = () => {
  return (
    <div className='bg-white text-black'>
          {/* <Barstage/> */}
          <Ihmage/>
          <Footer/>
      </div>
  )
}

export default page