import React from 'react'

const Verify = () => {
    return (
        <div className="relative w-full min-h-screen bg-pink-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 text-center rounded-2xl shadow-lg max-w-md w-full">

                {/* ✅ Icon + Heading */}
                <h2 className="text-2xl sm:text-xl md:text-2xl text-green-500 mb-4">
                    ✅ Check Your Email
                </h2>

                {/* Paragraph */}
                <p className="text-gray-400 text-sm sm:text-base">
                    We have sent you an email to verify your account. Please check your inbox and click the verification link to activate your account.
                </p>
            </div>
        </div>

    )
}

export default Verify