import React from 'react'
import Title from './_components/Title'
import OverviewCard from './_components/OverviewCard'
import { RevenueReport } from './_components/Chart'
import Link from 'next/link'
import RecentOrders from './orders/_components/recentOrders'

function Page() {

  return (
    <div className=''>
      <Title title="Over View" active="Dashboard" />
      <div className='space-y-[32px]'>
        <OverviewCard />
        <RevenueReport />
      </div>
      <div className='bg-[#fafafafa] pt-[69px] pb-2 px-14 mt-10 rounded-xl'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-semibold '>Recent Orders</h1>
          <Link href={"/dashboard/orders"}>
            <p className=' border-b-2 text-[#595959] font-semibold text-[16px] border-[#FF7F50]'>See All</p>
          </Link>
        </div>
        <RecentOrders />
      </div>
    </div>
  )
}

export default Page