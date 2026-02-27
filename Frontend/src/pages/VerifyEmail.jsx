import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { post } from '../api/endpoint';

const VerifyEmail = () => {
  const { token } = useParams();
  console.log("Token : ",token)
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();
  const verifyEmail = async () => {
    try {
      const res = await post("/user/verify", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }

      });

      if (res.data.success) {
        setStatus("✅ Email Verified Successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000)
      }
    } catch (error) {
      console.log(error);
      setStatus("❌ Email verification failed. Please try again");
    }
  }

  useEffect(() => {
    verifyEmail();
  }, [token])

  return (
    <div className='w-full min-h-screen bg-pink-100 flex px-4 items-center justify-center'>
      <div className="bg-white custom-shadow w-fit p-8 rounded-2xl ">
        <h2 className='text-xl text-gray-500'>{status}</h2>
      </div>
    </div>
  )
}

export default VerifyEmail