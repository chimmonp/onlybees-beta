import React from 'react'


const TicketPageLayout = ({ children }) => {


  return (
    <div className='min-h-[100svh] flex lg:flex-row flex-col justify-between'>
        {children}
    </div>
  )
}

export default TicketPageLayout