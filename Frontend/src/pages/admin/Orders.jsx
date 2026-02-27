import React, { useEffect, useState } from 'react'
import { BsArrowLeftCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from '../../api/endpoint';

const Orders = () => {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllOrders = async () => {
    try {
      const res = await get("/order/all");
      if (res?.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className='grid grid-cols-1 space-y-6 lg:px-10 px-4 lg:py-10 py-4'>

      {/* Header */}
      <div className="flex gap-3 items-center">
        <BsArrowLeftCircleFill
          onClick={() => navigate(-1)}
          className='text-3xl cursor-pointer text-gray-700 hover:text-black'
        />
        <h4 className='text-2xl font-semibold'>All Orders</h4>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-lg font-medium">
          Loading Orders...
        </div>
      ) : orders.length === 0 ? (

        /* Empty State */
        <div className="w-full flex items-center justify-center py-10">
          <img
            src="/order_not_found.svg"
            alt="No Orders Found"
            className='h-[40vh] object-contain'
          />
        </div>

      ) : (

        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">

          {/* Desktop Table */}
          <table className="min-w-full hidden md:table">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Products</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-sm">{order._id}</td>

                  <td className="px-6 py-4 capitalize">
                    {order.user?.firstname}
                  </td>

                  <td className="px-6 py-4">
                    {order.products.map((item) => (
                      <div key={item._id} className="text-sm">
                        {item.productId?.productName}
                        <span className="text-gray-500">
                          {" "} (x{item.quantity})
                        </span>
                      </div>
                    ))}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ₹{order.amount.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden">
            {orders.map((order) => (
              <div key={order._id} className="border-b p-4 space-y-2">

                <p>
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order._id}
                </p>

                <p>
                  <span className="font-semibold">User:</span>{" "}
                  {order.user?.firstname}
                </p>

                <div>
                  <span className="font-semibold">Products:</span>
                  {order.products.map((item) => (
                    <div key={item._id} className="ml-2 text-sm">
                      {item.productId?.productName}
                      <span className="text-gray-500">
                        {" "} (x{item.quantity})
                      </span>
                    </div>
                  ))}
                </div>

                <p>
                  <span className="font-semibold">Amount:</span>{" "}
                  ₹{order.amount.toFixed(2)}
                </p>

                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  )
}

export default Orders;