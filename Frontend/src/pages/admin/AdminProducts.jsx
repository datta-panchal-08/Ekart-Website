import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux'
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { toast } from 'react-toastify';
import { del, put, get } from '../../api/endpoint';
import { setProducts } from '../../redux/productSlice';
import ImageUpload from '../../components/ImageUpload';
import { RxCross2 } from 'react-icons/rx';

const AdminProducts = () => {

  const { products } = useSelector(store => store.product);
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState("lowToHigh");
  const dispatch = useDispatch();
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);

  const updateHandler = (productId) => {
    setIsOpen(true);
    const product = allProducts.find((p) => p._id === productId);
    setProductData(product);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priceFilter === "lowToHigh") {
      filtered = [...filtered].sort((a, b) => a.productPrice - b.productPrice);
    }

    if (priceFilter === "highToLow") {
      filtered = [...filtered].sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, allProducts,priceFilter]);

  const getAllProducts = async () => {
    try {
      const res = await get('/product/all-products')
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    getAllProducts();
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("productName", productData.productName);
    formdata.append("productPrice", productData.productPrice);
    formdata.append("productDesc", productData.productDesc);
    formdata.append("category", productData.category);
    formdata.append("brand", productData.brand);

    const existingImages = productData.productImg
      ?.filter((img) => !(img instanceof File) && img.public_id)
      ?.map((img) => img.public_id);

    formdata.append("existingImages", JSON.stringify(existingImages || []));

    productData.productImg
      ?.filter((img) => img instanceof File)
      ?.forEach((file) => {
        formdata.append("files", file);
      });

    try {
      setLoading(true);
      const res = await put(`/product/update/${productData._id}`, formdata);

      if (res.data.success) {
        toast.success(res.data.message);

        const updatedList = allProducts.map((p) =>
          p._id === productData._id ? res.data.product : p
        );

        setAllProducts(updatedList);
        dispatch(setProducts(
          search.trim()
            ? updatedList.filter(p =>
              p.productName?.toLowerCase().includes(search.toLowerCase())
            )
            : updatedList
        ));

        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setDeleteLoadingId(productId);

      const res = await del(`/product/delete/${productId}`);

      if (res.data.success) {
        toast.success(res.data.message);

        const updatedList = allProducts.filter(
          (p) => p._id !== productId
        );

        setAllProducts(updatedList);

        dispatch(setProducts(
          search.trim()
            ? updatedList.filter(p =>
              p.productName?.toLowerCase().includes(search.toLowerCase())
            )
            : updatedList
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting product");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className='px-10 lg:py-10 lg:pr-10 bg-gray-100 min-h-screen flex flex-col gap-2'>

      <div className="flex w-full justify-between items-center">
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className='rounded-lg bg-white w-1/3 py-2 px-2 border border-gray-200 outline-none'
          placeholder='Search Products...'
        />

        <div>
          <select onChange={(e) => setPriceFilter(e.target.value)} value={priceFilter} className="mt-1 w-full cursor-pointer font-semibold outline-none rounded-lg border-gray-200 border-2 bg-white py-2 px-2">
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-5">
        {products?.map((product) => (
          <div
            key={product?._id}
            className="custom-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-5 py-4 rounded-lg bg-white w-full"
          >
            <div className="flex gap-4 items-center flex-1 min-w-0">
              <img
                src={product?.productImg?.[0]?.url}
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain shrink-0"
              />
              <h1 className="font-semibold text-lg sm:text-xl break-words">
                {product?.productName}
              </h1>
            </div>

            <div className="flex md:flex-col flex-row lg:flex-row justify-between sm:items-center gap-3 sm:gap-6">
              <div className="text-left sm:text-right text-base sm:text-lg font-medium whitespace-nowrap">
                {product?.productPrice?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0
                })}
              </div>

              <div className="flex gap-4 justify-start sm:justify-end">
                <button
                  onClick={() => updateHandler(product?._id)}
                  className="text-lg sm:text-xl cursor-pointer hover:scale-105 duration-300"
                >
                  <FaRegEdit className="text-green-500" />
                </button>

                <button
                  onClick={() => deleteProduct(product?._id)}
                  className="w-9 h-9 cursor-pointer flex items-center justify-center hover:scale-110 duration-200"
                >
                  {deleteLoadingId === product?._id ? (
                    <div className="spinner"></div>
                  ) : (
                    <FiTrash2 className="text-red-600 text-xl" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          closeTimeoutMS={200}
          className="relative bg-white w-full sm:w-[90%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-h-[90vh] rounded-lg outline-none shadow-2xl flex flex-col"
          overlayClassName="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-3 sm:p-6"
        >
          <div className="sticky top-0 bg-white z-50 flex items-center justify-between px-4 sm:px-6 py-4 border-b">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Update Product Details
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <RxCross2 size={22} />
            </button>
          </div>

          <form
            onSubmit={submitHandler}
            className="flex flex-col gap-4 px-4 sm:px-6 py-4 overflow-y-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-semibold">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  onChange={handleChange}
                  value={productData?.productName || ""}
                  className="border border-gray-200 rounded-lg outline-none py-2 px-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold">Product Price</label>
                <input
                  type="number"
                  name="productPrice"
                  onChange={handleChange}
                  value={productData?.productPrice || ""}
                  className="border border-gray-200 rounded-lg outline-none py-2 px-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-semibold">Brand</label>
                <input
                  type="text"
                  name="brand"
                  onChange={handleChange}
                  value={productData?.brand || ""}
                  className="border border-gray-200 rounded-lg outline-none py-2 px-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold">Category</label>
                <input
                  type="text"
                  name="category"
                  onChange={handleChange}
                  value={productData?.category || ""}
                  className="border border-gray-200 rounded-lg outline-none py-2 px-2"
                />
              </div>
            </div>

            <textarea
              name="productDesc"
              onChange={handleChange}
              value={productData?.productDesc || ""}
              placeholder="Enter product description..."
              className="px-3 py-3 border border-gray-200 rounded-lg outline-none min-h-[120px]"
            />

            <ImageUpload
              productData={productData}
              setProductData={setProductData}
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner"></div>
                  </div>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default AdminProducts