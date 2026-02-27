import React, { useEffect, useState } from 'react'
import userLogo from '/User.png'
import { BsArrow90DegLeft, BsArrowLeft, BsArrowLeftCircleFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { get, put } from '../../api/endpoint';
import { toast } from 'react-toastify';

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);

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
      formdata.append("firstname", updateUser?.firstname);
      formdata.append("lastname", updateUser?.lastname);
      formdata.append("city", updateUser?.city);
      formdata.append("zipcode", updateUser?.zipcode);
      formdata.append("address", updateUser?.address);
      formdata.append("phoneNo", updateUser?.phoneNo);
      formdata.append("role", updateUser?.role);

      if (file) {
        formdata.append("file", file);
      }

      const res = await put(`/user/update/${id}`, formdata);

      if (res.data.success) {
        toast.success(res.data.message);

      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await get(`/user/get-user/${id}`);
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, [id])

  console.log(updateUser?.role);

  return (
    <div className='lg:px-10 grid-cols-1 space-y-4 px-4 lg:py-10 py-4'>
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className='text-2xl cursor-pointer'><BsArrowLeftCircleFill /></button>
        <h2 className='font-semibold text-xl'>Update Profile</h2>
      </div>
      <div className="">
        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start justify-center">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={updateUser?.profilepic || userLogo}
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
                  value={updateUser?.firstname || ""}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input-style"
                />

                <input
                  name="lastname"
                  value={updateUser?.lastname || ""}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="input-style"
                />
              </div>

              <input
                name="email"
                value={updateUser?.email || ""}
                placeholder="Email"
                onChange={handleChange}
                className="input-style"
              />

              <input
                name="phoneNo"
                value={updateUser?.phoneNo || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input-style"
              />

              <input
                name="address"
                value={updateUser?.address || ""}
                onChange={handleChange}
                placeholder="Address"
                className="input-style"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="city"
                  value={updateUser?.city || ""}
                  onChange={handleChange}
                  placeholder="City"
                  className="input-style"
                />

                <input
                  name="zipcode"
                  value={updateUser?.zipcode || ""}
                  onChange={handleChange}
                  placeholder="Zip Code"
                  className="input-style"
                />
              </div>

              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Select Role</h2>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={updateUser?.role === "admin"}
                    onChange={handleChange}
                  />
                  Admin
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={updateUser?.role === "user"}
                    onChange={handleChange}
                  />
                  User
                </label>

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
    </div>
  )
}

export default UserInfo