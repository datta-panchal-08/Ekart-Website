import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeftLong, FaRegTrashCan } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { TfiMinus, TfiPlus } from "react-icons/tfi";
import {toast} from 'react-toastify';
import { PiShoppingCart } from 'react-icons/pi';
import { del, put } from '../api/endpoint';
import { setCart } from '../redux/productSlice';
import { useEffect } from 'react';

const Cart = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access-token");
  const { cart } = useSelector(state => state.product);
  const dispatch = useDispatch();

  const subtotal = cart?.totalPrice;
  const shipping = subtotal > 299 ? 0 : 20;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await put("/cart/update", { productId, type });

      if (res?.data?.success) {
        dispatch(setCart(res.data.cart));
      }

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  const loadCart = async () => {
    try {
      const res = await get("/cart");
      if (res?.data?.success) {
        dispatch(setCart(res?.data?.items));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const removeItemFromCart = async (productId) => {
    try {
      const res = await del("/cart/remove", {productId });
      if (res?.data?.success) {
        dispatch(setCart(res.data.cart));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    loadCart();
  }, [dispatch])

return cart?.items?.length > 0 ? (
  <div className='grid grid-cols-1 gap-4 px-4 sm:px-6 lg:px-8 lg:py-5'>

    <div
      onClick={() => navigate(-1)}
      className="hidden lg:flex text-sm font-semibold items-center gap-2 cursor-pointer"
    >
      <FaArrowLeftLong className="h-6 w-6 rounded-full bg-gray-200 p-1" />
      <span>Go Back</span>
    </div>

    {/* Cart Items */}
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 py-2">

      {/* Left Section */}
      <div className="space-y-4">
        {
          cart?.items?.map((item) =>
            <div
              key={item._id}
              className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 custom-shadow rounded-md"
            >

              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  className='h-20 w-20 object-cover rounded'
                  src={item?.productId?.productImg[0]?.url}
                  alt={item.productId.productName}
                />

                <h2 className='text-zinc-600 font-semibold tracking-tighter text-sm sm:text-base'>
                  {item?.productId?.productName?.slice(0, 17)}
                </h2>
              </div>

              {/* Quantity */}
              <div className="quantity flex items-center gap-2 justify-between sm:justify-center">
                <button
                  onClick={() => handleUpdateQuantity(item.productId._id, "increase")}
                  className="flex cursor-pointer hover:bg-gray-400 duration-300 rounded-md items-center justify-center px-3 border border-gray-200 py-1"
                >
                  <TfiPlus className='text-sm' />
                </button>

                <span className='text-pink-600 px-3 text-sm'>
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleUpdateQuantity(item.productId._id, "decrease")}
                  className="flex cursor-pointer hover:bg-gray-400 duration-300 rounded-md items-center justify-center px-3 border border-gray-200 py-1"
                >
                  <TfiMinus className='text-sm' />
                </button>
              </div>

              {/* Price + Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-6">
                <h2 className='text-green-600 font-semibold text-sm sm:text-base'>
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </h2>

                <button
                  onClick={() => removeItemFromCart(item.productId._id)}
                  className="text-xl cursor-pointer text-red-600"
                >
                  <FaRegTrashCan />
                </button>
              </div>

            </div>
          )
        }
      </div>

      {/* Right Section */}
      <div className="py-4 px-4 sm:px-6 flex flex-col gap-3 rounded-md custom-shadow h-fit">
        <h1 className='font-semibold text-xl text-gray-600'>Order Summary</h1>

        <div className="flex flex-col gap-2">

          <div className="flex items-center justify-between text-sm sm:text-base">
            <span>
              Subtotal
              <span className='text-gray-400'> ({cart.items.length} {cart.items.length > 1 ? "items":"item"} )</span>
            </span>
            <h2 className='font-semibold text-gray-700'>
              ₹{cart?.totalPrice.toLocaleString("en-IN") || 0}
            </h2>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Shipping</span>
            <span>₹{shipping.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Tax (5%)</span>
            <span>₹{tax.toLocaleString("en-IN")}</span>
          </div>

          <hr className='text-gray-300' />

          <div className="flex font-semibold mt-2 items-center justify-between">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
            <input
              type="text"
              placeholder='Promo Code'
              className='py-2 px-2 outline-none border w-full border-gray-200 rounded-md'
            />
            <button className='border border-gray-200 cursor-pointer px-4 py-2 rounded-md'>
              Apply
            </button>
          </div>

          <button onClick={()=>navigate("/address")} className='py-2 rounded-md mt-1 text-sm bg-pink-600 text-white hover:bg-pink-700 duration-300 cursor-pointer font-semibold'>
            PLACE ORDER
          </button>

          <Link
            to={"/products"}
            className='custom-shadow text-center rounded-md mt-2 py-2'
          >
            Continue Shopping
          </Link>

          <div className="flex flex-col gap-1 text-gray-500 text-xs sm:text-sm">
            <h3>* Free shipping on orders over 299</h3>
            <h3>* 30-days return policy</h3>
            <h3>* Secure checkout with SSL encryption</h3>
          </div>

        </div>
      </div>

    </div>

  </div>
) : (
  <div className="flex gap-3 py-20 flex-col items-center justify-center px-4">
    <div className="bg-pink-100 text-red-600 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center text-6xl sm:text-7xl rounded-full">
      <PiShoppingCart />
    </div>

    <div className="flex flex-col gap-2 text-center">
      <h2 className='font-semibold text-xl sm:text-2xl'>Your Cart is Empty</h2>
      <p className='text-sm sm:text-base'>
        Looks like you haven't added anything to your cart yet
      </p>
    </div>

    <Link
      to={"/products"}
      className='text-white font-semibold rounded-xl px-8 py-2 bg-pink-500 hover:bg-pink-600 cursor-pointer duration-300'
    >
      Start Shopping
    </Link>
  </div>
)

}

export default Cart