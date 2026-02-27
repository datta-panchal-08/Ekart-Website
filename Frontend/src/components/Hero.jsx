import React from 'react'

const Hero = () => {
    return (
        <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-5 lg:py-16'>
            <div className="max-w-7xl px-4 mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Text section */}
                    <div className="order-2 md:order-1">
                        <h1 className='text-4xl md:text-6xl font-bold mb-4'>Latest Electronics at Best Prices.</h1>
                        <p className='text-xl mb-6 text-blue-100'>Discover cutting-edge technology with unbeatable deals on smartphones, laptops and more.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="bg-white hover:text-white text-blue-600 border border-white hover:border-gray-400 hover:bg-transparent px-4 py-1 rounded-md cursor-pointer transition-all duration-300">
                                Shop now
                            </button>
                            <button className='hover:bg-white border-white hover:text-blue-600 border-1 duration-300 bg-transparent text-white px-4 py-1 rounded-md cursor-pointer transition-all'>View deals</button>
                        </div>
                    </div>

                    {/* Image section */}
                    <div className="relative order-1 md:order-2">
                        <img src="/Hero.webp" alt="Hero.webp" width={500} height={400} className='rounded-lg custom-shadow-03' />
                    </div>
                </div>


            </div>
        </section>
    )
}

export default Hero