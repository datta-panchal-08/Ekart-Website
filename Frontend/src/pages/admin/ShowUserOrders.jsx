import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get } from '../../api/endpoint';
import { toast } from 'react-toastify';
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import OrderCard from '../../components/OrderCard';

const ShowUserOrders = () => {
  const {userId} = useParams();
  const [orders,setOrders] = useState(null);
  const navigate = useNavigate();
  const getOrdersById = async()=>{
    try {
      const res = await get(`/order/user/${userId}`);
      if(res.data.success){
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  
  useEffect(()=>{
    getOrdersById();
  },[userId])

  return (
    <div className='grid grid-cols-1 lg:px-10 px-4 lg:py-10 py-4'>
      <div className="flex gap-1 items-center">
        <BsArrowLeftCircleFill onClick={()=>navigate(-1)} className='text-3xl cursor-pointer'/>
         <h4 className='text-2xl font-semibold'>User Orders</h4> 
      </div>
      {
        orders?.length > 0 ? <div className="grid grid-cols-1 space-y-4 py-4">
             {
                orders?.map((order)=>{
                  return <OrderCard order={order} key={order._id}/>
                })
             }
        </div> : <div className="w-full flex mt-22 items-center justify-center">
              <img src="/order_not_found.svg" className=' h-[40vh] object-cover' />
        </div>
      }
    </div>
  )
}

export default ShowUserOrders