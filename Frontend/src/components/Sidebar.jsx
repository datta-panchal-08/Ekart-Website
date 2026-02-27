import React from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { LuPackagePlus, LuPackageSearch, LuUsersRound } from "react-icons/lu";
import { NavLink } from 'react-router-dom';
import { PiUsersThreeThin } from 'react-icons/pi';
import { FaRegEdit } from 'react-icons/fa';
const Sidebar = () => {
    return (
        <div className=' p-5 w-[250px] hidden space-y-2 h-screen fixed md:block border-r bg-pink-50 border-pink-200'>
            <div className="flex flex-col gap-4">
                <NavLink
                    to={"/dashboard/sales"}
                    className={({ isActive }) =>
                        `flex w-full font-semibold px-3 py-2 rounded-lg duration-300 cursor-pointer text-xl items-center gap-1 
                    ${isActive ? "bg-pink-600 text-white" : "hover:bg-pink-600 hover:text-white"}`
                    }
                >
                    <MdOutlineDashboard /> <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to={"/dashboard/add-product"}
                    className={({ isActive }) =>
                        `flex w-full font-semibold px-3 py-2 rounded-lg duration-300 cursor-pointer text-xl items-center gap-1 
                    ${isActive ? "bg-pink-600 text-white" : "hover:bg-pink-600 hover:text-white"}`
                    }
                >
                    < LuPackagePlus /> <span>Add Product</span>
                </NavLink>
                <NavLink
                    to={"/dashboard/products"}
                    className={({ isActive }) =>
                        `flex w-full font-semibold px-3 py-2 rounded-lg duration-300 cursor-pointer text-xl items-center gap-1 
                    ${isActive ? "bg-pink-600 text-white" : "hover:bg-pink-600 hover:text-white"}`
                    }
                >
                    < LuPackageSearch /> <span>Products</span>
                </NavLink>

                <NavLink
                    to={"/dashboard/users"}
                    className={({ isActive }) =>
                        `flex w-full font-semibold px-3 py-2 rounded-lg duration-300 cursor-pointer text-xl items-center gap-1 
                    ${isActive ? "bg-pink-600 text-white" : "hover:bg-pink-600 hover:text-white"}`
                    }
                >
                    < LuUsersRound /> <span>Users</span>
                </NavLink>

                <NavLink
                    to={"/dashboard/orders"}
                    className={({ isActive }) =>
                        `flex w-full font-semibold px-3 py-2 rounded-lg duration-300 cursor-pointer text-xl items-center gap-1 
                    ${isActive ? "bg-pink-600 text-white" : "hover:bg-pink-600 hover:text-white"}`
                    }
                >
                    < FaRegEdit /> <span>Orders</span>
                </NavLink>

            </div>
        </div>
    )
}

export default Sidebar