import Link from 'next/link'
import React from 'react'

//Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const Sidebar = () => {
    return (
        <div className="fixed flex flex-col lg:top-14 left-0 w-14 hover:w-[15vw] md:w-[15vw] bg-[#1b1b1b] h-full text-white transition-all duration-300 border-none z-10 sidebar">
            <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
                <ul className="flex flex-col py-4 space-y-1">
                    <li className="px-5 hidden md:block">
                        <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
                        </div>
                    </li>
                    <li>
                        
                        <Link href="/admin/dashboard" className=" hover:bg-black relative flex flex-row items-center h-11 focus:outline-none text-white-600 hover:text-white-800">
                            <span className="ml-10 text-sm tracking-wide truncate">Dashboard</span>
                        </Link>
                    </li>
                    <li className="px-5 hidden md:block">
                        <div className="flex flex-row items-center h-8">
                            <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Events</div>
                        </div>
                    </li>
                    <li>
                        <Link href="/admin/dashboard/add-event" className=" hover:bg-black relative flex flex-row gap-2 items-center h-11 focus:outline-none text-white-600 hover:text-white-800">
                            <AddIcon sx={{ fontSize: 15 }} className='ml-10'/>
                            <span className="text-sm tracking-wide truncate">Add</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/dashboard/edit-event" className=" hover:bg-black relative flex flex-row gap-2 items-center h-11 focus:outline-none text-white-600 hover:text-white-800">
                            <EditIcon sx={{ fontSize: 15 }} className='ml-10'/>
                            <span className="text-sm tracking-wide truncate">Edit</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/dashboard/delete-event" className=" hover:bg-black relative flex flex-row gap-2 items-center h-11 focus:outline-none text-white-600 hover:text-white-800">
                            <DeleteIcon sx={{ fontSize: 15 }} className='ml-10'/>
                            <span className="text-sm tracking-wide truncate">Delete</span>
                        </Link>
                    </li>
                </ul>
                <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">Copyright @2024</p>
            </div>
        </div>
    )
}

export default Sidebar