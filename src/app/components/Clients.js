import React from 'react'

import Image from 'next/image'

//Assets
import clients from "../../../public/clients.png"
import clients_mobile from "../../../public/clients_mobile.png"

const Clients = () => {
    return (
        <div className='md:mx-40 mx-10'>
            <h2 className='text-black font-semibold text-3xl lg:text-3xl my-5 mb-5 mx-auto font-coolvetica uppercase text-center'>CLIENTS</h2>
            <Image
                src={clients}
                width="0"
                height="0"
                sizes="100vw"
                className='md:block hidden mt-2 h-full w-full object-cover'
                alt='Clients'
            />
            <Image
                src={clients_mobile}
                width="0"
                height="0"
                sizes="100vw"
                className='md:hidden block mt-2 h-full w-full object-cover'
                alt='Clients'
            />
            <p className='font-light text-center mt-5'>AND MORE</p>
        </div>
    )
}

export default Clients