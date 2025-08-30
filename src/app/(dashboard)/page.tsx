import React from 'react'
import Title from './_components/Title'
import OverviewCard from './_components/OverviewCard'
import { RevenueReport } from './_components/Chart'
import OrderList from './orders/_components/orderList'
import Link from 'next/link'

function Page() {

  return (
    <div className='py-[14px] px-[50px]'>
      <Title title="Over View" active="Dashboard" />
      <div className='space-y-[32px]'>
        <OverviewCard />
        <RevenueReport />
      </div>
      <div className='bg-[#fafafafa] py-[69px] px-14 mt-10 rounded-xl'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-semibold '>Orders</h1>
          <Link href={"/orders"}>
            <p className=' border-b-2 text-[#595959] font-semibold text-[16px] border-[#FF7F50]'>See All</p>
          </Link>
        </div>
        <OrderList />
      </div>
    </div>
  )
}

export default Page