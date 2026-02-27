import React from 'react'
import { CiDeliveryTruck } from "react-icons/ci";
import { IoShieldOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";

const Features = () => {
  return (
    <section className='bg-muted/50 py-8 md:py-12 '>
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CiDeliveryTruck className='text-3xl text-blue-700'/>
                    </div>
                    <div>
                        <h3 className='font-semibold'>Free Shipping</h3>
                        <p className='text-gray-500'>On orders over $50 </p>
                    </div>
                </div>

                 <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <IoShieldOutline className='text-3xl text-green-600'/>
                    </div>
                    <div>
                        <h3 className='font-semibold'>Secure Payment</h3>
                        <p className='text-gray-500'>100% Secure Transactions </p>
                    </div>

                

                </div>

                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TfiHeadphoneAlt className='text-3xl text-purple-600'/>
                    </div>
                    <div>
                        <h3 className='font-semibold'>24/7 Support</h3>
                        <p className='text-gray-500'>Always here to help </p>
                    </div>

                

                </div>

            </div>
        </div>

    </section>
  )
}

export default Features