import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiShoppingCart } from "react-icons/pi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { post } from '../api/endpoint';
import {toast} from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/userSlice';

const Navbar = () => {
  const {user} = useSelector(state=>state.user);
  const { cart } = useSelector(state => state.product);
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access-token"));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const admin = user?.role === "admin" ? true : false;
  const [loading,setLoading] = useState(false);

  const logoutHandler = async () => {
    try {
      setLoading(true);
      const res = await post("/user/logout");

      if (res?.data?.success) {
        localStorage.removeItem("access-token");
        setAccessToken(null);
        dispatch(clearUser());
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }finally{
      setLoading(false);
    }
  };

  return (
    <header className='custom-shadow sticky top-0 flex h-[60px] bg-white justify-between items-center px-5 md:px-10 w-full z-20 '>

      {/* Logo */}
      <div className="overflow-hidden">
        <img src="/Ekart.png" alt="Ekart Logo" className='w-[130px]' />
      </div>

      {/* Desktop Nav */}
      <nav className='hidden md:flex items-center gap-5'>
        <ul className='flex gap-7 items-center text-lg '>
          <Link to={"/"} className='font-semibold text-gray-600 hover:text-pink-500 duration-300'>Home</Link>
          <Link to={"/products"} className='font-semibold text-gray-600 hover:text-pink-500 duration-300'>Products</Link>
          {user && <Link to={`/profile/${user._id}`} className='font-semibold text-gray-600 cursor-pointer hover:text-pink-500 duration-300'>Hi, {user?.firstname}</Link>}
          {admin && <Link to={`/dashboard/sales`} className='font-semibold text-gray-600 cursor-pointer hover:text-pink-500 duration-300'>Dashboard</Link>}
        </ul>

        <Link to={"/cart"} className='relative ml-5'>
          <PiShoppingCart className='text-2xl text-gray-700' />
          <span className='bg-pink-500 rounded-full absolute flex items-center justify-center -top-2 -right-2 text-white h-5 w-5 text-xs'>
            {cart?.items?.length || 0}
          </span>
        </Link>

        {user ? (
          <button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer px-4 py-1 rounded-md font-semibold ml-4'>{
            loading ? <div className="spinner"></div>:"Logout"
          }</button>
        ) : (
          <Link to={"/login"} className='text-white bg-gradient-to-tl from-blue-600 to-purple-600 cursor-pointer px-4 rounded-md py-1 ml-4'>Login</Link>
        )}
      </nav>

      {/* Mobile Hamburger */}
      <div className='md:hidden flex items-center'>
        <Link to={"/cart"} className='relative mr-3'>
          <PiShoppingCart className='text-2xl text-gray-700' />
          <span className='bg-pink-500 rounded-full absolute -top-2 -right-2 text-white px-2 text-xs'>0</span>
        </Link>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiOutlineX className='text-3xl text-gray-700' /> : <HiOutlineMenu className='text-3xl text-gray-700' />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='absolute top-[60px] left-0 w-full bg-white flex flex-col gap-4 px-5 py-5 md:hidden shadow-lg z-10'>
          <Link to={"/"} className='font-semibold text-gray-600 hover:text-pink-500 duration-300'>Home</Link>
          <Link to={"/products"} className='font-semibold text-gray-600 hover:text-pink-500 duration-300'>Products</Link>
          {user && <Link to={`/profile/${user._id}`} className='font-semibold text-gray-600 cursor-pointer hover:text-pink-500 duration-300'>Hi, {user.firstname}</Link>}
          {user ? (
            <button onClick={logoutHandler} className='bg-pink-600 flex items-center justify-center text-white px-4 py-1 rounded-md font-semibold'>{
              loading ? <div className="spinner"></div>:"Logout"
            }</button>
          ) : (
            <Link to={"/login"} className='text-white flex items-center justify-center bg-gradient-to-tl from-blue-600 to-purple-600 px-4 rounded-md py-1'>Login</Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
