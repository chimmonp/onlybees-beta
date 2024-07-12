import React from 'react'
import ErrorIcon from '@mui/icons-material/Error';

const EventNotFound = () => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center min-h-[80svh]'>
        <ErrorIcon sx={{ fontSize: 50 }}/>
        <p className='text-xl'>Event not found</p>
    </div>
  )
}

export default EventNotFound;