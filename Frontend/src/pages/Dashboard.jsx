import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { HiMenu } from "react-icons/hi";

const Dashboard = () => {

  const [open, setOpen] = useState(false)

  return (
    <div className='flex min-h-screen bg-gray-100'>

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 md:ml-[250px] w-full">

        <div className="md:hidden p-4 bg-white shadow flex items-center">
          <button onClick={() => setOpen(true)}>
            <HiMenu size={28} />
          </button>
          <h1 className='ml-4 font-semibold text-lg'>Dashboard</h1>
        </div>

        <div className="p-4">
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default Dashboard