import React from 'react'

//Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventsPage from './components/EventsPage'
import CookiesModal from '../components/CookiesModal'



const events = () => {
  return (
    <div className='bg-black'>
        <Navbar mode="dark" />
        <EventsPage />
        <Footer mode="dark" />
        <CookiesModal />
    </div>
  )
}

export default events;