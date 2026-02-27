import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { post } from '../api/endpoint';
import {toast} from 'react-toastify';
import { setCart } from '../redux/productSlice';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { products } = useSelector(store => store.product);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const selectImg = (index) => {
    setSelectedIndex(index);
  }

  const addToCart = async (productId) => {
    try {
      setLoading(true);
      const res = await post("/cart/add", { productId});
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (products && id) {
      const filteredProduct = products.find(
        (product) => product._id === id
      );

      setProduct(filteredProduct);
    }
  }, [id, products]);

  return (
    <div className="grid grid-cols-1 gap-5 px-4 lg:px-10 py-5">

      <div
        onClick={() => navigate(-1)}
        className="hidden lg:flex text-sm font-semibold items-center gap-2 cursor-pointer"
      >
        <FaArrowLeftLong className="h-6 w-6 rounded-full bg-gray-200 p-1" />
        <span>Go Back</span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr]'>

        {/* Image Section  */}
        <div className="custom-shadow rounded-lg overflow-hidden h-[45vh] lg:h-[68vh] lg:w-[85%]">
          <div
            className="img h-full hide-scrollbar relative overflow-auto"
            style={{
              backgroundImage: `url(${product?.productImg[selectedIndex]?.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          >
            <div className="px-5 absolute overflow-x-auto  bottom-5 flex gap-5 ">
              {
                product?.productImg?.length > 1 && product.productImg.map((img, i) => {
                  return <div key={i} className={`custom-shadow  overflow-hidden h-20 w-20 ${selectedIndex === i && "border-2 border-orange-500"} rounded-lg`}>
                    <img onClick={() => selectImg(i)} src={img.url} alt="" />
                  </div>
                })
              }
            </div>

          </div>

        </div>

        {/* Product Details Section */}

        <div className="flex flex-col gap-2 w-full py-5">

          <div className="">
            <h2 className='text-xl capitalize font-bold'>{product?.productName}</h2>
          </div>

          <div className="flex items-center  lg:gap-10">
            <span className='font-semibold text-green-500'>₹{product?.productPrice?.toLocaleString("en-IN")}</span>
            <span className=' bg-blue-50 px-5 py-1 rounded-lg text-red-400 font-semibold'>{product?.category}</span>
          </div>

          {/* <button className='py-2 bg-black font-semibold text-white rounded-lg'>Add to Cart</button>  */}

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              * About this item
            </h2>

            <p className="text-gray-600 mt-2 w-full tracking-wider text-[1rem] leading-6.5">
              {product?.productDesc?.replace("About this item", "").trim()}
            </p>

            <div className="lg:flex w-full lg:justify-end mt-4">
              <button onClick={() => addToCart(product._id)} className='bg-black text-white font-semibold rounded-lg py-2 w-full cursor-pointer lg:w-[40%] hover:bg-zinc-800 duration-300 '>
                {
                   loading ? <div className='flex items-center justify-center'><div className="spinner"></div></div>:"Add to Cart"  
                }</button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default ProductDetail