import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from '../../api/endpoint';
import Profile from '/User.png';
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
const AllUsers = () => {
  const [users, setUsers] = useState();
  const navigate = useNavigate();
  const getAllUsers = async () => {
    try {
      const res = await get("/user/all-users");
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }


  useEffect(() => {
    getAllUsers();
  }, [])

  return (
    <div className='grid grid-cols-1 lg:px-10 px-4 lg:py-10 py-4'>

      <div className="">
        <h1 className='text-xl font-semibold'>User Management</h1>
        <p className='text-sm'>View and manage registered users.</p>
      </div>

      <div className="search my-2">
        <input type="text" className='w-1/3 py-2 px-2 rounded-lg border-gray-200 border-1 outline-none bg-white ' placeholder='Search Users... ' />
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 lg:grid-cols-3">
        {
          users?.map((user) => {
            return <div key={user._id} className="bg-pink-100 flex flex-col gap-2 custom-shadow px-2 py-2 w-full rounded-lg">

            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                <div className="w-20 h-20 rounded-full border-2 border-pink-600 overflow-hidden">
                  <img src={user?.profilepic ? user.profilepic : Profile} alt={user?.firstname} className='w-full h-full object-cover' />
                </div>
              </div>

              <div className="flex flex-col mt-2">
                <h4 className='font-semibold capitalize'>{user.firstname} {user.lastname}</h4>
                <p className='text-[0.8rem]'>{user.email}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={()=>navigate(`/dashboard/users/${user._id}`)} className='flex w-fit gap-1 items-center bg-white text-black px-4 py-1 rounded-lg cursor-pointer'><FiEdit/> Edit</button>
               <button onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)} className='flex cursor-pointer w-fit gap-1 items-center bg-black text-white px-4 py-1 rounded-lg'><FaEye/> Show Orders</button>
            </div>

            </div>
          })
        }
      </div>

    </div>
  )
}

export default AllUsers