import { useState } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import { post } from '../../api/endpoint';
import { setProducts } from '../../redux/productSlice';
const AddProduct = () => {
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
  const {products} = useSelector(store=>store.product);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("productName", productData.productName);
    formdata.append("productPrice", productData.productPrice);
    formdata.append("productDesc", productData.productDesc);
    formdata.append("category", productData.category);
    formdata.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please upload atleast one image.");
      return;
    }

    productData.productImg.forEach((img) => {
      formdata.append("files", img);
    });
    
    try {
       setLoading(true);
       const res = await post("/product/add",formdata);

      if(res.data.success){
        toast.success(res.data.message);
        dispatch(setProducts([...products,res.data.product]));
      }

    } catch (error) {
       toast.error(error.response.data.message);
    }finally{
      setLoading(false);
    }

  }

  return (
    <div className='bg-gray-100 flex justify-center py-10 px-4 pr-10 mx-auto'>

      <form onSubmit={submitHandler} className='md:w-[80%] w-full rounded-lg bg-white custom-shadow flex px-5 py-2 flex-col gap-3'>

        <div className="flex flex-col gap-1">
          <h2 className='text-xl font-semibold'>Add Product</h2>
          <p className='text-sm '>Enter Product details below</p>
        </div>

        <div className="grid grid-cols-2 gap-2">

          <div className="grid gap-2">
            <label className='font-semibold'>Product Name</label>
            <input type="text" onChange={handleChange} name='productName' value={productData.productName} className='py-1 outline-none border-1 border-gray-200 px-2 rounded-lg' placeholder='Ex-Iphone' />
          </div>

          <div className="grid gap-2">
            <label className='font-semibold'>Price</label>
            <input onChange={handleChange} name='productPrice' value={productData.productPrice} type="number" className='py-1 outline-none border-1 border-gray-200 px-2 rounded-lg' placeholder='0' />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className='font-semibold'>Brand</label>
            <input onChange={handleChange} name='brand' value={productData.brand} type="text" className='py-1 outline-none border-1 border-gray-200 px-2 rounded-lg' placeholder='Ex-apple' />
          </div>

          <div className="grid gap-2">
            <label className='font-semibold'>Category</label>
            <input onChange={handleChange} name='category' value={productData.category} type="text" className='py-1 outline-none border-1 border-gray-200 px-2 rounded-lg' placeholder='Ex-mobile' />
          </div>

        </div>

        <div className="grid gap-2">
          <label className='font-semibold'>Description</label>
          <textarea onChange={handleChange} value={productData.productDesc} name="productDesc" placeholder='Enter brief description here..' className='py-2 outline-none border-1 resize-none border-gray-200 px-2 rounded-lg'>
          </textarea>
        </div>

        <ImageUpload productData={productData} setProductData={setProductData} />

        <button disabled={loading} type='submit' className='py-2 w-full rounded-lg bg-pink-500 hover:bg-pink-600 duration-300 cursor-pointer text-white font-semibold'>
          {
            loading ? <div className="flex justify-center">
              <div className="spinner"></div>
            </div> :"Add Product"
          }
        </button>

      </form>

    </div>
  )
}

export default AddProduct