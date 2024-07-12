import React from 'react'

//Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventsPage from './components/EventsPage'



const events = () => {
  return (
    <div className='bg-black'>
        <Navbar mode="dark" />
        <EventsPage />
        <Footer mode="dark" />
    </div>
  )
}

export default events;