import React from 'react'
import Title from './_components/Title'
import OverviewCard from './_components/OverviewCard'
import { RevenueReport } from './_components/Chart'

function Page() {
 
  return (
    <div className='py-[14px] px-[50px]'>
      <Title title="Over View" active="Dashboard" />
      <OverviewCard />
      <RevenueReport/>
    </div>
  )
}

export default Page