import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewAddress, removeAddress, setSelectedAddress } from '../redux/addressSlice';
import { FaAddressCard } from "react-icons/fa";
import { post } from '../api/endpoint';
import { toast } from 'react-toastify';
import { setCart } from '../redux/productSlice';
import { useNavigate } from 'react-router-dom';
const AddressForm = () => {

    const dispatch = useDispatch();
    const { addresses, selectedAddress } = useSelector(store => store.address);
    const { cart } = useSelector(store => store.product)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    });

    const [showForm, setShowForm] = useState(addresses?.length === 0);
    const subtotal = cart?.totalPrice;
    const shipping = subtotal > 299 ? 0 : 20;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

   const handlePayment = async () => {
    try {
        const { data } = await post("/order/create-order", {
            products: cart?.items?.map(item => ({
                productId: item?.productId?._id,
                quantity: item?.quantity
            })),
            tax,
            shipping,
            amount: total,
            currency: "INR"
        });

        if (!data.success) return toast.error("Something went wrong!");

        let paymentCompleted = false;

        const options = {
            key: import.meta.env.VITE_RAZOR_API_KEY,
            amount: data.order.amount,
            currency: data.order.currency,
            order_id: data.order.id,
            name: "Ekart",
            description: "Order Payment",

            handler: async function (response) {
                paymentCompleted = true; 

                const verifyRes = await post("/order/verify-payment", response);

                if (verifyRes.data.success) {
                    toast.success("Payment Successful");
                    dispatch(setCart({ items: [], totalPrice: 0 }));
                    navigate("/order-success");
                } else {
                    toast.error("Payment verification failed");
                }
            },

            modal: {
                ondismiss: async () => {
                    if (!paymentCompleted) { 
                        await post("/order/verify-payment", {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true
                        });
                        toast.error("Payment Failed or Cancelled");
                    }
                }
            }
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", async function () {
            if (!paymentCompleted) { 
                await post("/order/verify-payment", {
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                });
                toast.error("Payment Failed. Please try again");
            }
        });

        rzp.open();

    } catch (error) {
        toast.error("Something went wrong while processing payment");
    }
};

    const handleSave = (e) => {
        e.preventDefault();
        dispatch(addNewAddress(formData));
        setShowForm(false);
    };

    return (
        <div className='min-h-screen bg-gray-50 px-4 py-6 lg:px-16'>


            <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>

                <div className="space-y-6">

                    {showForm ? (

                        <form
                            onSubmit={handleSave}
                            className='bg-white rounded-xl shadow-md p-6 space-y-4'
                        >
                            <h2 className='text-2xl font-semibold'>Add New Address</h2>

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>
                                    <label className='font-medium'>Full Name</label>
                                    <input
                                        type="text"
                                        name='fullName'
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                    />
                                </div>

                                <div>
                                    <label className='font-medium'>Phone</label>
                                    <input
                                        type="number"
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                    />
                                </div>

                                <div>
                                    <label className='font-medium'>Email</label>
                                    <input
                                        type="email"
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                    />
                                </div>

                                <div>
                                    <label className='font-medium'>City</label>
                                    <input
                                        type="text"
                                        name='city'
                                        value={formData.city}
                                        onChange={handleChange}
                                        className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                    />
                                </div>

                                <div>
                                    <label className='font-medium'>State</label>
                                    <input
                                        type="text"
                                        name='state'
                                        value={formData.state}
                                        onChange={handleChange}
                                        className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                    />
                                </div>

                                <div>
                                    <label className='font-medium'>Zip Code</label>
                                    <input
                                        type="number"
                                        name='zip'
                                        value={formData.zip}
                                        onChange={handleChange}
                                        className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                    />
                                </div>

                            </div>

                            <div>
                                <label className='font-medium'>Address</label>
                                <input
                                    type="text"
                                    name='address'
                                    value={formData.address}
                                    onChange={handleChange}
                                    className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                />
                            </div>

                            <div>
                                <label className='font-medium'>Country</label>
                                <input
                                    type="text"
                                    name='country'
                                    value={formData.country}
                                    onChange={handleChange}
                                    className='w-full mt-1 px-3 py-2 border rounded-lg outline-none'
                                />
                            </div>

                            <button
                                type="submit"
                                className='w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition'
                            >
                                Save & Continue
                            </button>

                        </form>

                    ) : (

                        <>
                            <h1 className='text-2xl font-semibold'>Saved Address</h1>

                            <div className="grid gap-4">

                                {addresses?.map((address, index) => (
                                    <div
                                        key={index}
                                        onClick={() => dispatch(setSelectedAddress(index))}
                                        className={`relative cursor-pointer p-4 rounded-xl shadow-md transition
                                        ${selectedAddress === index
                                                ? "bg-pink-100 border border-pink-500"
                                                : "bg-white"
                                            }`}
                                    >
                                        <h2 className='font-semibold'>{address.fullName}</h2>
                                        <p>{address.phone}</p>
                                        <p className='text-sm text-gray-600'>{address.email}</p>
                                        <p className='text-sm mt-1'>
                                            {address.address}, {address.city}, {address.zip},
                                            {address.state}, {address.country}
                                        </p>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch(removeAddress(index));
                                            }}
                                            className='absolute top-2 right-2 text-red-500 text-sm'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}

                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className='w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition flex justify-center items-center gap-2'
                                >
                                    <FaAddressCard />
                                    New Address
                                </button>

                                <button
                                    disabled={selectedAddress === null}
                                    onClick={handlePayment}
                                    className='w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50'
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    )}

                </div>

                <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-6">

                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal ( {cart?.items?.length} )</span>
                            <span>₹ {subtotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹ {shipping}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹ {tax.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total</span>
                            <span>₹ {total.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-gray-500 text-xs sm:text-sm">
                            <h3>* Free shipping on orders over 299</h3>
                            <h3>* 30-days return policy</h3>
                            <h3>* Secure checkout with SSL encryption</h3>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AddressForm;