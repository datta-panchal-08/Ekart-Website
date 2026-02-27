import React, { useEffect, useState } from 'react'
import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import { toast } from 'react-toastify'
import { get } from '../api/endpoint'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '../redux/productSlice'
import { FiFilter } from 'react-icons/fi'

const Products = () => {

  const { products } = useSelector(state => state.product);
  const [allProducts, setAllProducts] = useState([]);
  const dispatch = useDispatch();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [priceFilter, setPriceFilter] = useState("lowToHigh");
  const [showFilter, setShowFilter] = useState(false);

  const getAllProducts = async () => {
    try {
      const res = await get('/product/all-products')
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  useEffect(() => {
    let filtered = [...allProducts];

    if (search.trim())
      filtered = filtered.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );

    if (category !== "All")
      filtered = filtered.filter(p => p.category === category);

    if (brand !== "All")
      filtered = filtered.filter(p => p.brand === brand);

    if (priceFilter === "lowToHigh")
      filtered.sort((a,b)=>a.productPrice-b.productPrice);

    if (priceFilter === "highToLow")
      filtered.sort((a,b)=>b.productPrice-a.productPrice);

    dispatch(setProducts(filtered));

  }, [search, category, brand, priceFilter, allProducts]);

  return (
    <div className="relative flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-8 max-w-[1400px] mx-auto">

      <div className="lg:hidden flex justify-end">
        <button
          onClick={()=>setShowFilter(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      <div className="hidden lg:block">
        <FilterSidebar
          brand={brand}
          setBrand={setBrand}
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          allProducts={allProducts}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
        />
      </div>

      {showFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setShowFilter(false)} />
          <div className="relative w-[280px] bg-white h-full p-4 overflow-y-auto">
            <FilterSidebar
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              search={search}
              setSearch={setSearch}
              allProducts={allProducts}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
            />
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Products