import React, { useContext } from 'react'
import { MedContext } from '../context/MedContext'
import dayjs from "dayjs";

const Patients = () => {
    const {selectedDate} = useContext(MedContext)
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <p>{dayjs(selectedDate).format("YYYY-MM-DD")}</p>
        </div>
    )
}

export default Patients