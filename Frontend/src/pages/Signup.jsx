import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../api/endpoint";
import {toast} from "react-toastify";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
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
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await post("/user/register",formData);
      if(res.data.success){
          toast.success(res?.data?.message);
          resetVal();
          navigate("/verify");
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
          <h2 className="text-lg font-semibold">Create your account</h2>
          <p className="text-sm text-gray-400">
            Enter details to create your account
          </p>
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold">First Name</label>
            <div className="flex items-center border border-gray-300 rounded px-2">
              <FaUser className="text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="John"
                onChange={handleChange}
                value={formData.firstname}
                name="firstname"
                className="w-full px-2 py-1 outline-none
                placeholder:text-sm placeholder:font-semibold placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Last Name</label>
            <div className="flex items-center border border-gray-300 rounded px-2">
              <FaUser className="text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Doe"
                onChange={handleChange}
                value={formData.lastname}
                name="lastname"
                className="w-full px-2 py-1 outline-none
                placeholder:text-sm placeholder:font-semibold placeholder:text-gray-400"
              />
            </div>
          </div>
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
            loading ? <div className="flex items-center justify-center"><div className="spinner"></div></div>:"Signup"
          }
        </button>
        <p className="text-center text-gray-400 ">Already have an account? <Link to={"/login"} className="text-blue-500 hover:underline cursor-pointer">Login</Link> </p>
      </form>
    </div>
  );
};

export default Signup;
