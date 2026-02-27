import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import {toast} from 'react-toastify';
import { post } from '../api/endpoint';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';


const Login = () => {
 const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispact = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const resetVal = () => {
    setFormData({
      email: "",
      password: ""
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await post("/user/login",formData);
      if(res.data.success){
          toast.success(res?.data?.message);
          dispact(setUser(res?.data?.user));
          localStorage.setItem("access-token",res?.data?.accessToken);
          resetVal();
          navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100 px-3">
      <form onSubmit={submitHandler} className="bg-white w-full max-w-md rounded-xl px-4 py-4 grid gap-3 custom-shadow">

        {/* Heading */}
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold">Sign in to your account</h2>
          <p className="text-sm text-gray-400">
            We're happy to see you again
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-semibold">Email</label>
          <div className="flex items-center border border-gray-300 rounded px-2">
            <FaEnvelope className="text-gray-400 text-sm" />
            <input
              type="email"
              placeholder="johndoe@example.com"
              onChange={handleChange}
              name="email"
              value={formData.email}
              className="w-full px-2 py-1 outline-none
              placeholder:text-sm placeholder:font-semibold placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-semibold">Password</label>
          <div className="flex items-center border border-gray-300 rounded px-2">
            <FaLock className="text-gray-400 text-sm" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              name="password"
              className="w-full px-2 py-1 outline-none
              placeholder:text-sm placeholder:font-semibold placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button disabled={loading} className="bg-zinc-900 cursor-pointer text-white py-2 rounded-md font-semibold hover:bg-zinc-800 transition">
          {
            loading ? <div className="flex items-center justify-center"><div className="spinner"></div></div>:"Login"
          }
        </button>
        <p className="text-center text-gray-400 ">Don't have an account? <Link to={"/signup"} className="text-blue-500 hover:underline cursor-pointer">Signup</Link> </p>
      </form>
    </div>
  );
};

export default Login