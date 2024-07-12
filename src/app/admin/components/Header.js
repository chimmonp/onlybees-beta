import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// images
import logo from "../../../../public/OnlyBees_light.svg"

const Header = () => {
    return (
        <div className="fixed w-[15vw] flex items-center justify-between h-14 text-white z-10">
            <div className="lg:flex hidden items-center justify-start md:justify-center w-14 md:w-64 h-14 bg-[#1b1b1b] border-none">
                <Link href='/'>
                    <Image
                        src={logo}
                        width={150}
                        height="auto"
                        alt='logo'
                        className='mt-4'
                    />
                </Link>
            </div>
        </div>
    )
}

export default Header