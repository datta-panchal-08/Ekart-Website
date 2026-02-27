import React from 'react'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ order }) => {
    const navigate = useNavigate();

    return (
        <div className='custom-shadow bg-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-4 rounded-lg'>

            {/* Order Id & Amount */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h4 className='font-semibold break-all text-sm sm:text-base'>
                    OrderId : {order?._id}
                </h4>
                <h4 className='text-sm sm:text-base'>
                    Amount: {order?.currency} {order?.amount?.toLocaleString("en-IN")}
                </h4>
            </div>

            {/* User Information And Payment Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex flex-col text-sm sm:text-base break-words">
                    <h4>
                        <span className='font-semibold'>User:</span> {order?.user?.firstname} {order?.user?.lastname}
                    </h4>
                    <h4>
                        <span className='font-semibold'>Email: </span>
                        <span className="break-all">{order?.user?.email}</span>
                    </h4>
                </div>

                <span
                    className={`${order?.status === "Paid"
                        ? "py-1 px-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 duration-300 cursor-pointer text-center w-fit"
                        : "py-1 px-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 duration-300 cursor-pointer text-center w-fit"
                        }`}
                >
                    {order?.status}
                </span>
            </div>

            {/* Products */}
            <div className="lg:px-10 flex flex-col gap-3">
                {
                    order?.products?.map((product) => {
                        return (
                            <div
                                key={product?.productId?._id}
                                className="flex flex-col sm:flex-row custom-shadow bg-white rounded-lg px-3 py-3 gap-4 sm:justify-between"
                            >
                                {/* Image & Title */}
                                <div className="flex gap-3 items-start sm:items-center">
                                    <img
                                        onClick={() => navigate(`/product/${product?.productId?._id}`)}
                                        src={product?.productId?.productImg[0]?.url}
                                        alt={product?.productId?.productName}
                                        className='h-[10vh] sm:h-[12vh] w-[80px] sm:w-auto object-cover cursor-pointer hover:scale-105 duration-300 rounded'
                                    />
                                    <h4 className='font-semibold text-sm sm:text-[1.1rem] break-words'>
                                        {product?.productId?.productName}
                                    </h4>
                                </div>

                                {/* Quantity & Price */}
                                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-4 sm:gap-2 text-sm sm:text-base">
                                    <h4>
                                        <span className='font-semibold'>Quantity :</span> {product?.quantity}
                                    </h4>
                                    <h4>
                                        <span className='font-semibold'>Price :</span>{" "}
                                        {product?.quantity * product?.productId?.productPrice}
                                    </h4>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default OrderCard