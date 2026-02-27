import React from 'react'

const FilterSidebar = ({ allProducts, search, setSearch, category, setCategory, brand, setBrand ,priceFilter,setPriceFilter}) => {

  const categories = allProducts.map(p => p.category);
  const uniqueCategory = ["All", ...new Set(categories)];

  const brands = allProducts.map(p => p.brand);
  const uniqueBrand = ["All", ...new Set(brands)];

  const resetFilters = () =>{
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceFilter("lowToHigh");
  }

  return (
    <div className='flex flex-col gap-4 p-4 bg-gray-100 rounded-xl w-full lg:w-[280px] max-h-[80vh] overflow-y-auto'>

      <input
        type="text"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className='border border-gray-300 outline-none py-2 bg-white rounded-md px-2 w-full'
        placeholder='Search...'
      />

      <div className="flex flex-col gap-2">
        <h2 className='font-semibold'>Category</h2>
        {uniqueCategory.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              checked={category === item}
              onChange={() => setCategory(item)}
            />
            <label>{item}</label>
          </div>
        ))}
      </div>

      <div>
        <h2 className='font-semibold'>Brand</h2>
        <select
          className='mt-1 py-2 border border-gray-300 rounded-md bg-white w-full px-2'
          value={brand}
          onChange={(e)=>setBrand(e.target.value)}
        >
          {uniqueBrand.map((item, index) => (
            <option value={item} key={index}>{item}</option>
          ))}
        </select>
      </div>

      <div>
        <h2 className='font-semibold'>Price</h2>
        <select
          value={priceFilter}
          onChange={(e)=>setPriceFilter(e.target.value)}
          className="mt-1 w-full border rounded-md border-gray-300 bg-white py-2 px-2"
        >
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className='bg-pink-600 hover:bg-pink-700 transition text-white rounded-md py-2 font-semibold'
      >
        Reset
      </button>

    </div>
  )
}

export default FilterSidebar