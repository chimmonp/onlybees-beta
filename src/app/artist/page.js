import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

//Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ComingSoon from '../components/ComingSoon'

const Artist = () => {
    return (
        <div className='bg-white text-black '>
            <Navbar mode="light" />
            <ComingSoon />
            <Footer mode="light" />
        </div>
    )
}

export default Artist

