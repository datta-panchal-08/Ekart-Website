import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 max-w-lg w-full text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-7xl md:text-8xl animate-bounce" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Order Placed Successfully 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Thank you for your purchase. Your order has been confirmed and will
          be shipped soon. You will receive an email confirmation shortly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-medium transition duration-300 w-full sm:w-auto"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl font-medium transition duration-300 w-full sm:w-auto"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;