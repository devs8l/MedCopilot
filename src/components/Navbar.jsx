import React from 'react'
import DatePicker from './DatePicker'
import { Moon ,Search,CircleHelp } from 'lucide-react';
import DateSort from './DateSort';


const Navbar = () => {
    return (
        <div className='grid grid-cols-[2fr_1fr] sm:grid-cols-[1fr_2fr_1fr] gap-4 py-5 px-5'>
            <div className=' py-3'>
                <h1 className='text-3xl sf-bold '>MedCopilot</h1>
                <p className='text-sm text-gray-600'>Product by JNC Tech</p>
            </div>
            <div className='hidden  md:flex sm:flex lg:flex py-3 gap-3 items-center'>
                <DatePicker/>
                <DateSort/>
                <Search className='ml-5'/>
                <CircleHelp className='ml-5'/>
            </div>
            <div className='flex justify-center items-center gap-2 py-3'>
                <Moon className='h-6 w-6'/>
                <h1 className='text-xl'>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h1>
            </div>

        </div>
    )
}

export default Navbar