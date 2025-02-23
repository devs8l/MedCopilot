import React from 'react'
import UserData from './UserData'
import Patients from './Patients'

const Hero = () => {
    return (
        <div className="drop-shadow-md bg-white rounded-2xl  transition-all duration-300  overflow-y-auto ">
            {location.pathname === "/user" ? <UserData /> : <Patients />}
        </div>
    )
}

export default Hero