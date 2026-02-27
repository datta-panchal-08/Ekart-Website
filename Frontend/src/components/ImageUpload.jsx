import { RxCross2 } from "react-icons/rx";

const ImageUpload = ({ productData, setProductData }) => {

  const handleFiles = (e) => {
    let files = Array.from(e.target.files || []);
    if (files.length) {
      setProductData((prev) => ({
        ...prev,
        productImg: [...prev.productImg, ...files]
      }));
    }
  }

 const removeImg = (idx) => {
  setProductData((prev) => ({
    ...prev,
    productImg: prev.productImg.filter((_, index) => index !== idx)
  }));
};

  return (
    <div className='grid gap-2'>
      <label className='font-semibold'>Product Images</label>
      <input type="file" id='file-upload' className='hidden' accept='image/*' multiple onChange={handleFiles} />
      <button type='button' className='border-1 w-full py-2 rounded-lg border-gray-200'>
        <label htmlFor="file-upload" className='cursor-pointer font-semibold'>Upload Images</label>
      </button>

      {/* image preview */}

      {
        productData.productImg.length > 0 &&
        (
          <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
            {
              productData.productImg.map((file, idx) => {
                let preview;

                if (file instanceof File) {
                  preview = URL.createObjectURL(file)
                } else if (typeof file === "string") {
                  preview = file
                } else if (file?.url) {
                  preview = file.url
                } else {
                  return null;
                }
                return (
                  <div key={idx} className="relative overflow-hidden">
                    <div className="content">
                      <img src={preview} alt="" width={200} height={200} className='h-32 object-cover w-full rounded-md' />
                      <button onClick={() => removeImg(idx)} type="button" className="absolute px-2 py-2 right-0 hover:scale-95 top-0 bg-black text-white cursor-pointer duration-300 font-bold rounded-full ">
                        <RxCross2 />
                      </button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )

      }

    </div>
  )
}

export default ImageUpload