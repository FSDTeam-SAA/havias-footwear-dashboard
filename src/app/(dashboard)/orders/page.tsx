import React from 'react'
import OrderList from './_components/orderList'
import Link from 'next/link'

const Page = () => {
   

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#595959] mb-1">
                        Order
                    </h1>
                    <div className="flex items-center space-x-2 text-sm">
                        <Link
                            href="/dashboard"
                            className="text-gray-500 text-base hover:text-gray-700 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <span className="text-gray-400">›</span>
                        <span className="text-gray-500 text-base">Order</span>
                    </div>
                </div>
            </div>
            <OrderList  />
        </div>
    )
}

export default Page