import React, { useEffect, useState } from 'react'
import { get } from '../../api/endpoint';
import {
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

const Sales = () => {

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
    sales: []
  });

  const getSalesData = async () => {
    try {
      const res = await get("/order/sales");
      if (res?.data?.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    getSalesData();
  }, []);

  return (
    <div className='w-full px-4 lg:px-10 py-6 lg:py-10 space-y-8'>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="custom-shadow p-5 rounded-xl text-white bg-pink-500 flex flex-col justify-between min-h-[120px]">
          <h2 className='font-medium text-sm'>Total Users</h2>
          <span className='text-2xl font-semibold'>{stats?.totalUsers}</span>
        </div>

        <div className="custom-shadow p-5 rounded-xl text-white bg-purple-500 flex flex-col justify-between min-h-[120px]">
          <h2 className='font-medium text-sm'>Total Products</h2>
          <span className='text-2xl font-semibold'>{stats?.totalProducts}</span>
        </div>

        <div className="custom-shadow p-5 rounded-xl text-white bg-indigo-500 flex flex-col justify-between min-h-[120px]">
          <h2 className='font-medium text-sm'>Total Orders</h2>
          <span className='text-2xl font-semibold'>{stats?.totalOrders}</span>
        </div>

        <div className="custom-shadow p-5 rounded-xl text-white bg-green-500 flex flex-col justify-between min-h-[120px]">
          <h2 className='font-medium text-sm'>Total Sales</h2>
          <span className='text-2xl font-semibold'>
            ₹{stats?.totalSales?.toLocaleString("en-IN")}
          </span>
        </div>

      </div>

      {/* Sales Chart */}
      <div className="w-full bg-white custom-shadow rounded-xl p-4 sm:p-6">

        <h1 className='text-lg sm:text-xl font-semibold mb-4'>
          Sales (Last 30 Days)
        </h1>

        <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px] ">

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.sales}>


              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#F472B6"
                fill="#F472B6"
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>
      </div>

    </div>
  )
}

export default Sales