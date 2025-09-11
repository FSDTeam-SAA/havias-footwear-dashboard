"use client"
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import icon1 from "../../../../public/images/icon1.png"
import icon2 from "../../../../public/images/icon2.png"
import icon3 from "../../../../public/images/icon3.png"
import icon4 from "../../../../public/images/icon4.png"
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'

const OverviewCard = () => {
    const session = useSession()
    const token = (session?.data?.user as { accessToken: string })?.accessToken

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard-data"],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (!res.ok) throw new Error("Failed to fetch dashboard data")
            return res.json()
        },
        enabled: !!token,
    })

    const dashboard = data?.data

    const cards = [
        { title: "Total Products", value: dashboard?.totalProducts ?? 0, icon: icon1 },
        { title: "Total Revenue", value: dashboard?.totalRevenue ?? 0, icon: icon2 },
        { title: "Total Sellers", value: dashboard?.totalSellers ?? 0, icon: icon3 },
        { title: "Total Users", value: dashboard?.totalUsers ?? 0, icon: icon4 },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {cards.map((card, index) => (
                <Card key={index} className="shadow-[0px_2px_6px_0px_#00000014]">
                    <CardContent className="flex items-center justify-between pt-6 pb-10 pl-8 pr-24 gap-4 bg-white shadow-md rounded-lg">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[20px] text-[#272727] font-medium">
                                {card.title}
                            </h1>
                            <p className="flex items-center text-[18px] text-[#545454] font-medium">
                                <span className="inline-block bg-[#008000] w-3 h-3 rounded-full mr-2"></span>
                                {isLoading ? "Loading..." : card.value.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-[54px] h-[54px]">
                            <Image
                                alt="icon"
                                src={card.icon}
                                width={900}
                                height={900}
                                className="object-contain"
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default OverviewCard
