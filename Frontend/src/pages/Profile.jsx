import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import userLogo from "/User.png";
import { get, put } from "../api/endpoint";
import { toast } from "react-toastify";
import { setUser } from "../redux/userSlice";
import {BsArrowLeftCircleFill} from 'react-icons/bs'
import OrderCard from "../components/OrderCard";

const Profile = () => {
    const { user } = useSelector((store) => store.user);
    const { userId } = useParams();
    const token = localStorage.getItem("access-token");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isOrdercliked, setIsOrederClicked] = useState(false);
    const [orders,setOrders] = useState(null);
    const navigate = useNavigate();
    const [updateUser, setUpdateUser] = useState({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        phoneNo: user?.phoneNo || "",
        address: user?.address || "",
        zipcode: user?.zipcode || "",
        city: user?.city || "",
        email: user?.email || "",
        profilePic: user?.profilePic || "",
        role: user?.role || "",
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setUpdateUser({
            ...updateUser,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setUpdateUser({
            ...updateUser,
            profilePic: URL.createObjectURL(selectedFile),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const formdata = new FormData();
            formdata.append("firstname", updateUser.firstname);
            formdata.append("lastname", updateUser.lastname);
            formdata.append("city", updateUser.city);
            formdata.append("zipcode", updateUser.zipcode);
            formdata.append("address", updateUser.address);
            formdata.append("phoneNo", updateUser.phoneNo);
            formdata.append("email", updateUser.email);
            formdata.append("role", updateUser.role);

            if (file) {
                formdata.append("file", file);
            }

            const res = await put(`/user/update/${userId}`, formdata, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const getMyOrders = async()=>{
        try {
            const res = await get("/order/my-orders");
            if(res.data.success){
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    useEffect(()=>{
        getMyOrders();
    },[isOrdercliked])
 
    return (
        <div className="w-full bg-gray-100 min-h-screen py-8 sm:py-10">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6 justify-center items-center mb-8 px-4">
                <button
                    onClick={() => setIsOrederClicked(false)}
                    className={`w-full sm:w-auto px-6 py-2 rounded-md font-semibold transition ${!isOrdercliked
                            ? "bg-white shadow-md"
                            : "bg-transparent"
                        }`}
                >
                    Profile
                </button>

                <button
                    onClick={() => setIsOrederClicked(true)}
                    className={`w-full sm:w-auto px-6 py-2 rounded-md font-semibold transition ${isOrdercliked
                            ? "bg-white shadow-md"
                            : "bg-transparent"
                        }`}
                >
                    Orders
                </button>
            </div>

            {!isOrdercliked ? (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-8 text-center">
                        Update Profile
                    </h2>

                    <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start justify-center">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={updateUser.profilePic || user.profilepic || userLogo}
                                className="h-28 w-28 sm:h-32 sm:w-32 border-2 border-pink-500 rounded-full object-cover"
                                alt="Profile"
                            />

                            <label
                                htmlFor="profilePic"
                                className="cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-full text-sm sm:text-base hover:bg-pink-700 transition"
                            >
                                Change Picture
                            </label>

                            <input
                                id="profilePic"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Form */}
                        <div className="w-full max-w-xl">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white shadow-md p-4 sm:p-6 rounded-lg flex flex-col gap-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        name="firstname"
                                        value={updateUser.firstname}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className="input-style"
                                    />

                                    <input
                                        name="lastname"
                                        value={updateUser.lastname}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        className="input-style"
                                    />
                                </div>

                                <input
                                    name="email"
                                    value={updateUser.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="input-style"
                                />

                                <input
                                    name="phoneNo"
                                    value={updateUser.phoneNo}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="input-style"
                                />

                                <input
                                    name="address"
                                    value={updateUser.address}
                                    onChange={handleChange}
                                    placeholder="Address"
                                    className="input-style"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        name="city"
                                        value={updateUser.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="input-style"
                                    />

                                    <input
                                        name="zipcode"
                                        value={updateUser.zipcode}
                                        onChange={handleChange}
                                        placeholder="Zip Code"
                                        className="input-style"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-pink-600 text-white py-2.5 rounded-md font-semibold hover:bg-pink-700 transition"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="spinner"></div>
                                        </div>
                                    ) : (
                                        "Update Profile"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : <div className="w-full px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl flex items-center gap-2 font-semibold mb-8 ">
                   <BsArrowLeftCircleFill onClick={()=>navigate(-1)} className="text-3xl cursor-pointer text-black" /> Your Orders
                </h2>
                <div className="">
                  {
                     orders?.length > 0 ? <div className="grid grid-cols-1 space-y-4 lg:px-28">
                        {
                            orders.map((order)=>{
                                return <OrderCard key={order._id} order={order}/>
                            })
                        }
                     </div> : <p>No orders found.</p>
                  }
                </div> 
                 </div>}
        </div>
    );
};

export default Profile;
