import React from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <div className='px-4  sm:px-[1vw] lg:px-[2vw] md:px-[2vw] bg-primary min-h-screen'>
      <Navbar/>
      <Home/>
    </div>
  )
}

export default App